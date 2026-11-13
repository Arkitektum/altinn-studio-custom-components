import type { ApiValue } from "../types.ts";
// Local functions
import { API_ORIGIN, getPackageFileUrl } from "./apiHelpers.ts";

/**
 * The upgrade preview on the Display layouts page: the drawn form, once with the version of the package the app has installed and once with the local build, side by side, with the components whose output differs marked.
 *
 * Each version is drawn in a frame of its own, since one page can define each custom element only once. A frame is given the form's elements as markup, with their data in their attributes, and the text resources on its globals, and draws them when its version's main.js defines them.
 */

/** The class a component whose output differs between the versions is marked with, in both frames. */
export const DIFFERS_CLASS = "upgrade-preview-differs";

/**
 * The version of the package an app has installed, as its package-lock.json says.
 *
 * @param {Array} packageVersions - Every app's package versions, as synchronized.
 * @param {string} appOwner
 * @param {string} appName
 * @returns {string | undefined} The version, or undefined when it is not known.
 */
export function getInstalledVersion(packageVersions: ApiValue[] | undefined, appOwner: string, appName: string): string | undefined {
    const version = packageVersions?.find((app: ApiValue) => app.appOwner === appOwner && app.appName === appName)?.packageVersions
        ?.altinnStudioCustomComponents;
    return typeof version === "string" && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version) ? version : undefined;
}

/** JSON that can sit inside a script element: "<" is escaped, so the data cannot close the element. */
function scriptJson(value: unknown) {
    return JSON.stringify(value ?? null).replaceAll("<", String.raw`\u003c`);
}

function escapeAttribute(value: string) {
    return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

export interface PreviewDocumentOptions {
    /** The address of the version's main.js. */
    scriptUrl: string;
    /** The address of the version's main.css. */
    styleUrl: string;
    /** The app's own text resources, in the language chosen on the page. */
    textResources: unknown;
    /** The package's default text resources for this version. */
    defaultTextResources: unknown;
    language: string;
    /** The form's elements as markup. */
    componentsHtml: string;
    /** What the single page view draws on the page before the form, as markup: the app's logo, and the heading of a main form. */
    pageHeadHtml?: string;
    /** The app's classes for body, which the logo's size and place in the version's styles are read from, e.g. "org-dibk". */
    bodyClasses?: string[];
    /** Where scripts, styles and fonts may come from: the dev server and -api. */
    allowedOrigins: string[];
    /** Let the frame's scripts evaluate strings, which the dev server's build of the local bundle needs: it is built with eval source maps. */
    allowEval?: boolean;
}

/**
 * The document a frame draws one version in.
 *
 * The page is laid out as the single page view lays it out, `#admin-main > .page` on a body with the app's classes, so each version's own styles size and place the logo, and with every box sized as the dev tools' styles size it (border-box). The frame never scrolls: it is made as tall as its page, and the mouse wheel over it scrolls the page it is on. The text resources are put on the globals both the current and older versions read them from. Its content security policy lets it load scripts, styles, fonts and images only from the dev server and -api, and fetch nothing, so an older version's start-up cannot reach the app or Altinn's CDN. That includes the dev server's live reload, so the local frame is not reloaded, and its marks lost, when a file is saved; the browser logs the blocked connection once.
 *
 * @param {PreviewDocumentOptions} options
 * @returns {string} The document, for the frame's srcdoc.
 */
export function buildPreviewDocument(options: PreviewDocumentOptions) {
    const origins = options.allowedOrigins.join(" ");
    const policy = [
        "default-src 'none'",
        `script-src 'unsafe-inline'${options.allowEval ? " 'unsafe-eval'" : ""} ${origins}`,
        `style-src 'unsafe-inline' ${origins}`,
        `font-src data: ${origins}`,
        `img-src data: ${origins}`,
        "connect-src 'none'"
    ].join("; ");
    return `<!doctype html>
<html lang="${escapeAttribute(options.language)}">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${escapeAttribute(policy)}">
<link rel="stylesheet" href="${escapeAttribute(options.styleUrl)}">
<style>.${DIFFERS_CLASS} { outline: 3px solid #e5a000; outline-offset: 2px; } *, *::before, *::after { box-sizing: border-box; } html, body { margin: 0; background: #fff; overflow: hidden; } #admin-main > .page { position: relative; box-sizing: border-box; padding: 1cm 1.25cm; } #admin-main > .page > h1 { margin-top: 67px; margin-bottom: 22px; }</style>
<script>
const textResources = ${scriptJson(options.textResources)};
const defaultTextResources = ${scriptJson(options.defaultTextResources)};
globalThis.selectedLanguage = ${scriptJson(options.language)};
globalThis.textResources = textResources;
globalThis.defaultTextResources = defaultTextResources;
globalThis.appConfig = { selectedLanguage: ${scriptJson(options.language)}, textResources, defaultTextResources };
</script>
</head>
<body class="${escapeAttribute((options.bodyClasses ?? []).join(" "))}">
<div id="admin-main"><div class="page">${options.pageHeadHtml ?? ""}<div id="preview-components">${options.componentsHtml}</div></div></div>
<script src="${escapeAttribute(options.scriptUrl)}"></script>
</body>
</html>`;
}

/**
 * A component's output, made comparable: whitespace is evened out, and every id is numbered in the order it appears, along with the references to it (such as `aria-labelledby`), since components generate random ids and two drawings of the same version would otherwise never match.
 *
 * @param {Element} element - The component's container.
 * @returns {string} The output.
 */
export function drawnOutput(element: Element) {
    let html = element.innerHTML.replaceAll(/\s+/g, " ").replaceAll("> <", "><").trim();
    const ids = [...new Set(Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]!))];
    ids.forEach((id, index) => {
        const escaped = id.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
        html = html.replaceAll(new RegExp(`(["\\s])${escaped}(?=["\\s])`, "g"), `$1id-${index + 1}`);
    });
    return html;
}

/**
 * Compares what each version drew for each component of the form, and marks the components whose output differs in both.
 *
 * @param {Document} installedDocument - The frame drawn with the installed version.
 * @param {Document} localDocument - The frame drawn with the local build.
 * @returns {{ differing: number[], total: number }} The positions of the components that differ, and how many there are.
 */
export function compareDrawnComponents(installedDocument: Document, localDocument: Document) {
    const installed = Array.from(installedDocument.getElementById("preview-components")?.children ?? []);
    const local = Array.from(localDocument.getElementById("preview-components")?.children ?? []);
    const total = Math.max(installed.length, local.length);
    const differing: number[] = [];
    for (let index = 0; index < total; index++) {
        const installedElement = installed[index];
        const localElement = local[index];
        if (!installedElement || !localElement || drawnOutput(installedElement) !== drawnOutput(localElement)) {
            differing.push(index);
            installedElement?.classList.add(DIFFERS_CLASS);
            localElement?.classList.add(DIFFERS_CLASS);
        }
    }
    return { differing, total };
}

/** The width of an A4 page, as the single page view draws it, in each orientation. */
export const PAGE_WIDTHS = { portrait: "21cm", landscape: "29.7cm" } as const;

/** The smallest the comparison is shown at to fit side by side. Below it the text gets too small to read, and the pages scroll sideways instead. */
export const MIN_COMPARISON_SCALE = 0.5;

/** The gap between the two frames, in CSS pixels, which is not shrunk with them. */
const COMPARISON_GAP = 16;

/** The width one frame takes at full size: the page and its border, in CSS pixels. */
export function getFrameWidth(orientation: keyof typeof PAGE_WIDTHS) {
    return (Number.parseFloat(PAGE_WIDTHS[orientation]) * 96) / 2.54 + 2;
}

/**
 * How much to shrink the frames so both fit in the width there is, beside the gap between them, never past full size or below MIN_COMPARISON_SCALE.
 *
 * @param {number} availableWidth - The width there is, in CSS pixels.
 * @param {"portrait" | "landscape"} orientation - The pages' orientation.
 * @returns {number} The scale, 1 for full size.
 */
export function getComparisonScale(availableWidth: number, orientation: keyof typeof PAGE_WIDTHS) {
    if (!(availableWidth > 0)) return 1;
    return Math.min(1, Math.max(MIN_COMPARISON_SCALE, (availableWidth - COMPARISON_GAP) / (2 * getFrameWidth(orientation))));
}

/**
 * Shrinks the frames to fit the width of the comparison, and says how much when it does. The stylesheet zooms the frames by `--upgrade-preview-zoom`, set on their row. Zoom, unlike a transform, shrinks the room the frames take as well as what they show.
 *
 * @param {HTMLElement} columnsElement - The frames' row.
 * @param {HTMLElement} scaleElement - Where to say how much the pages are shrunk.
 * @param {number} availableWidth - The width there is, in CSS pixels.
 * @param {"portrait" | "landscape"} orientation - The pages' orientation.
 */
export function fitComparison(columnsElement: HTMLElement, scaleElement: HTMLElement, availableWidth: number, orientation: keyof typeof PAGE_WIDTHS) {
    const scale = getComparisonScale(availableWidth, orientation);
    const percent = Math.round(scale * 100);
    if (percent < 100) {
        columnsElement.style.setProperty("--upgrade-preview-zoom", String(scale));
    } else {
        columnsElement.style.removeProperty("--upgrade-preview-zoom");
    }
    scaleElement.hidden = percent >= 100;
    scaleElement.textContent = percent < 100 ? `Shown at ${percent}% to fit side by side.` : "";
}

/**
 * The orientation the form is printed in: landscape when the components drawn in any of the frames asked for it, as gjennomfoeringsplan does, and portrait otherwise.
 *
 * @param {Array<Window | null>} frameWindows - The frames' windows, after their components are drawn.
 * @returns {"portrait" | "landscape"} The orientation.
 */
export function getPageOrientation(...frameWindows: (Window | null)[]): keyof typeof PAGE_WIDTHS {
    return frameWindows.some((frameWindow) => (frameWindow as { pageOrientation?: string } | null)?.pageOrientation === "landscape")
        ? "landscape"
        : "portrait";
}

/** The pixels a frame is given beyond what it drew, so rounding at a zoom below 100% cannot cut off the bottom of the page. */
export const FRAME_HEIGHT_ALLOWANCE = 4;

/**
 * How tall what a frame drew is: its body, which, unlike the document, is not stretched to the frame's own height and so can also get shorter.
 *
 * @param {HTMLIFrameElement} frame - The frame.
 * @returns {number} The height, in CSS pixels, or 0 when the frame has no document.
 */
export function getDrawnHeight(frame: HTMLIFrameElement) {
    const body = frame.contentDocument?.body;
    return body ? Math.ceil(Math.max(body.scrollHeight, body.getBoundingClientRect().height)) : 0;
}

/**
 * Makes each frame as wide as an A4 page in the given orientation, and as tall as what it drew, and keeps it as tall as that while what it drew changes height, as when an image or a font arrives after the frame has loaded.
 *
 * @param {HTMLIFrameElement[]} frames - The frames.
 * @param {"portrait" | "landscape"} orientation - The orientation.
 */
export function sizeFramesAsPages(frames: HTMLIFrameElement[], orientation: keyof typeof PAGE_WIDTHS) {
    for (const frame of frames) {
        frame.style.width = PAGE_WIDTHS[orientation];
    }
    for (const frame of frames) {
        const fitHeight = () => {
            // A few pixels to spare, inside the page's bottom margin: a zoomed frame rounds its height, and could otherwise cut off the last pixel or two.
            frame.style.height = `${getDrawnHeight(frame) + FRAME_HEIGHT_ALLOWANCE}px`;
        };
        fitHeight();
        // The frame's own ResizeObserver, since the body it watches is in the frame's document. Setting the frame's height does not change the body's, so it cannot set itself off.
        const FrameResizeObserver = (frame.contentWindow as (Window & typeof globalThis) | null)?.ResizeObserver;
        const body = frame.contentDocument?.body;
        if (FrameResizeObserver && body) {
            new FrameResizeObserver(fitHeight).observe(body);
        }
    }
}

/** Resolves once a frame has loaded its document, scripts and styles. */
function frameLoaded(frame: HTMLIFrameElement): Promise<void> {
    return new Promise((resolve) => frame.addEventListener("load", () => resolve(), { once: true }));
}

/**
 * A frame for one version, as wide as a portrait page from the start, so it does not jump from the browser's default width once its form is drawn.
 *
 * @param {string} title - What the frame shows, for assistive technology.
 * @returns {HTMLIFrameElement} The frame.
 */
export function createFrame(title: string) {
    const frame = document.createElement("iframe");
    frame.title = title;
    frame.classList.add("upgrade-preview-frame");
    frame.style.width = PAGE_WIDTHS.portrait;
    return frame;
}

export interface UpgradePreviewOptions {
    version: string;
    /** The form's elements as markup. */
    componentsHtml: string;
    /** The logo, and the heading of a main form, as the single page view draws them before the form. */
    pageHeadHtml: string;
    /** The app's classes for body, e.g. "org-dibk" and "app-et-v4". */
    bodyClasses: string[];
    /** The ids, or tag names, of the form's components, in order, to name the ones that differ. */
    componentNames: string[];
    textResources: unknown;
    /** The package's default text resources from the local source, in the language chosen on the page. */
    localDefaultTextResources: unknown;
    language: string;
}

/**
 * Draws the form with the installed version and with the local build, side by side, and says which components differ.
 *
 * @param {HTMLElement} containerElement - Where to show the preview.
 * @param {UpgradePreviewOptions} options
 * @returns {Promise<{ differing: number[], total: number } | null>} What differs, or null when the installed version could not be loaded.
 */
export async function renderUpgradePreview(containerElement: HTMLElement, options: UpgradePreviewOptions) {
    const { version } = options;
    const statusElement = document.createElement("p");
    statusElement.classList.add("upgrade-preview-status");
    statusElement.setAttribute("role", "status");
    statusElement.textContent = `Loading version ${version}…`;
    containerElement.replaceChildren(statusElement);

    let installedDefaultTextResources: unknown;
    try {
        const response = await fetch(getPackageFileUrl(version, "resource.nb.json"));
        if (!response.ok) throw new Error(`answered ${response.status}`);
        installedDefaultTextResources = await response.json();
    } catch (error) {
        console.error(`Could not load version ${version} of the package:`, error);
        statusElement.textContent = `Version ${version} could not be loaded from the API. Is it running, and can it reach npm?`;
        return null;
    }

    const allowedOrigins = [globalThis.location.origin, API_ORIGIN];
    const installedFrame = createFrame(`The form drawn with version ${version}`);
    const localFrame = createFrame("The form drawn with the local build");
    const common = {
        textResources: options.textResources,
        language: options.language,
        componentsHtml: options.componentsHtml,
        pageHeadHtml: options.pageHeadHtml,
        bodyClasses: options.bodyClasses,
        allowedOrigins
    };
    installedFrame.srcdoc = buildPreviewDocument({
        ...common,
        scriptUrl: getPackageFileUrl(version, "main.js"),
        styleUrl: getPackageFileUrl(version, "main.css"),
        defaultTextResources: installedDefaultTextResources
    });
    localFrame.srcdoc = buildPreviewDocument({
        ...common,
        scriptUrl: new URL("main.js", globalThis.location.origin).href,
        styleUrl: new URL("main.css", globalThis.location.origin).href,
        defaultTextResources: options.localDefaultTextResources,
        // The dev server builds main.js with eval source maps. The installed version is a published, minified build and needs no eval.
        allowEval: true
    });

    const columnsElement = document.createElement("div");
    columnsElement.classList.add("upgrade-preview-columns");
    for (const [heading, frame] of [
        [`Installed: ${version}`, installedFrame],
        ["Local build", localFrame]
    ] as [string, HTMLIFrameElement][]) {
        const columnElement = document.createElement("div");
        columnElement.classList.add("upgrade-preview-column");
        const headingElement = document.createElement("h3");
        headingElement.textContent = heading;
        columnElement.append(headingElement, frame);
        columnsElement.appendChild(columnElement);
    }
    const loaded = Promise.all([frameLoaded(installedFrame), frameLoaded(localFrame)]);
    statusElement.textContent = `Drawing the form with version ${version} and with the local build…`;
    containerElement.appendChild(columnsElement);
    await loaded;

    const installedDocument = installedFrame.contentDocument;
    const localDocument = localFrame.contentDocument;
    if (!installedDocument || !localDocument) {
        statusElement.textContent = "The drawings could not be compared.";
        return null;
    }
    const result = compareDrawnComponents(installedDocument, localDocument);
    const orientation = getPageOrientation(installedFrame.contentWindow, localFrame.contentWindow);
    sizeFramesAsPages([installedFrame, localFrame], orientation);
    const scaleElement = document.createElement("p");
    scaleElement.classList.add("upgrade-preview-scale");
    statusElement.after(scaleElement);
    fitComparison(columnsElement, scaleElement, containerElement.clientWidth, orientation);
    // Fitted again as the window is resized, for as long as these frames are shown. The window rather than the container is watched: zooming the frames changes the container's height, and a ResizeObserver on it would set itself off.
    const refit = () => {
        if (!columnsElement.isConnected) {
            globalThis.removeEventListener("resize", refit);
            return;
        }
        fitComparison(columnsElement, scaleElement, containerElement.clientWidth, orientation);
    };
    globalThis.addEventListener("resize", refit);
    const names = result.differing.map((index) => options.componentNames[index] ?? `component ${index + 1}`);
    statusElement.textContent = result.differing.length
        ? `${result.differing.length} of ${result.total} components draw differently with the local build than with ${version}, marked in both: ${names.join(", ")}.`
        : `Every component draws the same with the local build as with ${version}. Styles are not compared, only what is drawn.`;
    return result;
}
