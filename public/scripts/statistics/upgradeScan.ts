import type { ApiValue } from "../types.ts";
import type { RenderTarget } from "./renderHealth.ts";
// Local functions
import { API_ORIGIN, fetchAltinnStudioForms, fetchExampleData, getPackageFileUrl } from "./apiHelpers.ts";
import { buildPreviewDocument, compareDrawnComponents, createFrame, frameLoaded, getInstalledVersion } from "./upgradePreview.ts";
import { applyTextResourcesForLanguage } from "./textResourceLanguage.ts";
import { drawLayoutComponents } from "./drawComponents.ts";
import { getDisplayLayoutsAddress } from "./pageLinks.ts";
import { getRenderTargets } from "./renderHealth.ts";
import { getResourcesForLanguage } from "../textResourceGetters.ts";
import { pluralize } from "../formatters.ts";

/**
 * The upgrade check: every form drawn with each of its example files, once with the version of the package its app has installed and once with the local build, listing the forms that draw differently. It is the comparison on the Display layouts page, done for every form, in nb.
 *
 * One frame is loaded for each installed version and one for the local build, and each drawing is put into them in turn, since loading a version for every drawing would take far longer.
 */

/** A drawing that draws differently with the local build. */
export interface UpgradeScanChange {
    formName: string;
    fileName: string | undefined;
    /** The ids, or tag names, of the form's components that draw differently. */
    components: string[];
    /** The address of the Display layouts comparison for this form and example file. */
    link: string;
}

/** What the check found for one app. */
export interface UpgradeScanApp {
    appOwner: string;
    appName: string;
    /** The version the app has installed, undefined when it is not known, and the app is then not checked. */
    version: string | undefined;
    drawings: number;
    changes: UpgradeScanChange[];
    /** Set when the installed version could not be loaded, and the app was not checked. */
    unavailable?: boolean;
}

export interface UpgradeScanResult {
    apps: UpgradeScanApp[];
    lastUpdated: string | number | undefined;
}

/**
 * Draws one drawing in the installed version and the local build, and answers the components that draw differently, or null when the installed version could not be loaded.
 */
export type DrawPair = (target: RenderTarget, version: string) => Promise<string[] | null>;

/**
 * The address of the Display layouts comparison for a drawing.
 *
 * @param {RenderTarget} target - The drawing.
 * @returns {string} The address.
 */
export function getComparisonLink(target: RenderTarget) {
    return getDisplayLayoutsAddress({
        displayLayoutAppOwner: target.appOwner,
        displayLayoutAppName: target.appName,
        formType: target.formType,
        fileNames: target.fileNames,
        compare: true
    });
}

/**
 * The ids, or tag names, of a form's drawn components, in the order they are drawn, to name those that differ.
 *
 * @param {RenderTarget} target - The drawing.
 * @returns {string[]} The names.
 */
export function getComponentNames(target: RenderTarget) {
    return target.components.filter((component) => component?.tagName).map((component) => component!.id || component!.tagName || "");
}

/**
 * Checks every drawing, app by app, with the app's own nb texts. An app with no known installed version is listed and not drawn.
 *
 * @param {RenderTarget[]} targets - The drawings. Those without an example file are skipped.
 * @param {Array} packageVersions - Every app's package versions, as synchronized.
 * @param {DrawPair} drawPair - Draws one drawing both ways.
 * @param {Function} [onProgress] - Called with how many drawings are done, and how many there are, after each.
 * @returns {Promise<UpgradeScanApp[]>} Each app, in the order of the drawings.
 */
export async function runUpgradeScan(
    targets: RenderTarget[],
    packageVersions: ApiValue[] | undefined,
    drawPair: DrawPair,
    onProgress: (done: number, total: number) => void = () => {}
) {
    const apps: Map<string, UpgradeScanApp> = new Map();
    const drawable = targets.filter(({ fileName }) => fileName !== undefined);
    let appliedFor = "";
    for (const [index, target] of drawable.entries()) {
        const key = `${target.appOwner}/${target.appName}`;
        let app = apps.get(key);
        if (!app) {
            app = {
                appOwner: target.appOwner,
                appName: target.appName,
                version: getInstalledVersion(packageVersions, target.appOwner, target.appName),
                drawings: 0,
                changes: []
            };
            apps.set(key, app);
        }
        if (app.version && !app.unavailable) {
            if (key !== appliedFor) {
                applyTextResourcesForLanguage(
                    globalThis.multilingualDefaultTextResources,
                    globalThis.multilingualAppResourceValues,
                    "nb",
                    target.appOwner,
                    target.appName
                );
                appliedFor = key;
            }
            const differing = await drawPair(target, app.version);
            if (differing === null) {
                app.unavailable = true;
            } else {
                app.drawings++;
                if (differing.length) {
                    app.changes.push({
                        formName: target.formName,
                        fileName: target.fileName,
                        components: differing,
                        link: getComparisonLink(target)
                    });
                }
            }
        }
        onProgress(index + 1, drawable.length);
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return [...apps.values()];
}

/**
 * Loads the frames the check draws in, one for each installed version as it is first needed and one for the local build, out of sight, and draws drawings in them.
 *
 * @returns {{ drawPair: DrawPair, dispose: () => void }} The drawing function, and what removes the frames.
 */
export function createFrameDrawer() {
    const hostElement = document.createElement("div");
    hostElement.setAttribute("aria-hidden", "true");
    hostElement.classList.add("upgrade-scan-frames");
    hostElement.style.cssText = "position: absolute; left: -10000px; top: 0; width: 21cm; visibility: hidden;";
    document.body.appendChild(hostElement);
    const frames: Map<string, Promise<HTMLIFrameElement | null>> = new Map();
    const allowedOrigins = [globalThis.location.origin, API_ORIGIN];

    const loadFrame = async (version: string | null) => {
        let defaultTextResources: unknown;
        if (version) {
            try {
                const response = await fetch(getPackageFileUrl(version, "resource.nb.json"));
                if (!response.ok) throw new Error(`answered ${response.status}`);
                defaultTextResources = await response.json();
            } catch (error) {
                console.error(`Could not load version ${version} of the package:`, error);
                return null;
            }
        } else {
            defaultTextResources = getResourcesForLanguage(globalThis.multilingualDefaultTextResources || [], "nb");
        }
        const frame = createFrame(version ? `The forms drawn with version ${version}` : "The forms drawn with the local build");
        frame.srcdoc = buildPreviewDocument({
            scriptUrl: version ? getPackageFileUrl(version, "main.js") : new URL("main.js", globalThis.location.origin).href,
            styleUrl: version ? getPackageFileUrl(version, "main.css") : new URL("main.css", globalThis.location.origin).href,
            textResources: null,
            defaultTextResources,
            language: "nb",
            componentsHtml: "",
            allowedOrigins,
            allowEval: !version
        });
        const loaded = frameLoaded(frame);
        hostElement.appendChild(frame);
        await loaded;
        return frame;
    };
    const getFrame = (version: string | null) => {
        const key = version ?? "local";
        if (!frames.has(key)) frames.set(key, loadFrame(version));
        return frames.get(key)!;
    };

    const drawIn = (frame: HTMLIFrameElement, html: string) => {
        const frameGlobals = frame.contentWindow as unknown as Record<string, unknown> & { appConfig?: Record<string, unknown> };
        frameGlobals.textResources = globalThis.textResources;
        frameGlobals.fallbackTextResources = null;
        frameGlobals.fallbackDefaultTextResources = null;
        frameGlobals.appConfig = { ...frameGlobals.appConfig, textResources: globalThis.textResources };
        frame.contentDocument!.getElementById("preview-components")!.innerHTML = html;
    };

    const drawPair: DrawPair = async (target, version) => {
        const [installedFrame, localFrame] = await Promise.all([getFrame(version), getFrame(null)]);
        if (!installedFrame || !localFrame?.contentDocument || !installedFrame.contentDocument) return null;
        // Built here, where nothing is drawn: the elements carry their data in their attributes, and draw once they are in a frame.
        const html = drawLayoutComponents(target.components, target.dataModels, target.dataType, target.fileNames)
            .map(({ element }) => element.outerHTML)
            .join("");
        drawIn(installedFrame, html);
        drawIn(localFrame, html);
        await new Promise((resolve) => setTimeout(resolve, 0));
        const { differing } = compareDrawnComponents(installedFrame.contentDocument, localFrame.contentDocument);
        const names = getComponentNames(target);
        drawIn(installedFrame, "");
        drawIn(localFrame, "");
        return differing.map((index) => names[index] ?? `component ${index + 1}`);
    };

    return { drawPair, dispose: () => hostElement.remove() };
}

let lastResult: UpgradeScanResult | null = null;
let running = false;

/**
 * Renders the upgrade check page: a button that compares every form with every example file, and what the last check found.
 *
 * @param {HTMLElement} containerElement - The element the page is drawn in.
 */
export function renderUpgradeCheckPage(containerElement: HTMLElement) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Upgrade check";

    const paperElement = document.createElement("div");
    paperElement.classList.add("paper", "upgrade-check");
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent =
        "Draws every app's display layouts and subforms with each of their example files, in nb, once with the version of the package the app has installed and once with the local build, and lists the forms that would draw differently after an upgrade. Styles are not compared, only what is drawn.";

    const controlsElement = document.createElement("div");
    controlsElement.classList.add("render-health-controls");
    const buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.id = "upgrade-check-button";
    const progressElement = document.createElement("span");
    progressElement.id = "upgrade-check-progress";
    progressElement.setAttribute("role", "status");
    controlsElement.append(buttonElement, progressElement);

    const resultsElement = document.createElement("div");
    resultsElement.id = "upgrade-check-results";

    const showRunning = (isRunning: boolean) => {
        buttonElement.disabled = isRunning;
        buttonElement.textContent = isRunning ? "Checking…" : "Check all apps";
    };
    showRunning(running);
    renderUpgradeCheckResults(resultsElement, lastResult);

    buttonElement.onclick = async () => {
        if (running) return;
        running = true;
        showRunning(true);
        const setProgress = (text: string) => {
            const currentProgressElement = document.getElementById("upgrade-check-progress");
            if (currentProgressElement) currentProgressElement.textContent = text;
        };
        setProgress("Loading the example data…");
        const drawer = createFrameDrawer();
        try {
            const exampleData = globalThis.exampleData || (await fetchExampleData());
            const altinnStudioForms = globalThis.altinnStudioForms || (await fetchAltinnStudioForms());
            globalThis.exampleData = exampleData;
            globalThis.altinnStudioForms = altinnStudioForms;
            const lastUpdated = globalThis.lastUpdated;
            const targets = getRenderTargets(globalThis.displayLayouts, exampleData, altinnStudioForms);
            const apps = await runUpgradeScan(targets, globalThis.packageVersions, drawer.drawPair, (done, total) =>
                setProgress(`Compared ${done} of ${total} ${pluralize(total, "drawing")}`)
            );
            lastResult = { apps, lastUpdated };
            const currentResultsElement = document.getElementById("upgrade-check-results");
            if (currentResultsElement) renderUpgradeCheckResults(currentResultsElement, lastResult);
            setProgress("");
        } catch (error) {
            console.error("Could not check the apps:", error);
            setProgress("The check could not finish. The console says why.");
        } finally {
            drawer.dispose();
            running = false;
            const currentButtonElement = document.getElementById("upgrade-check-button") as HTMLButtonElement | null;
            if (currentButtonElement) {
                currentButtonElement.disabled = false;
                currentButtonElement.textContent = "Check all apps";
            }
        }
    };

    paperElement.append(descriptionElement, controlsElement, resultsElement);
    containerElement.append(titleElement, paperElement);
}

/**
 * Shows what a check found: a summary, each app whose forms would change with the drawings that differ, linked to their comparison, and the apps that draw the same, or were not checked.
 *
 * @param {HTMLElement} resultsElement - Where to show it.
 * @param {UpgradeScanResult|null} result - What the last check found, null before the first.
 */
export function renderUpgradeCheckResults(resultsElement: HTMLElement, result: UpgradeScanResult | null) {
    resultsElement.replaceChildren();
    if (!result) return;
    if (result.lastUpdated !== globalThis.lastUpdated) {
        const staleElement = document.createElement("p");
        staleElement.classList.add("render-health-stale");
        staleElement.textContent = "These results are from before the last synchronization. Check again to see the current data.";
        resultsElement.appendChild(staleElement);
    }
    const checked = result.apps.filter((app) => app.version && !app.unavailable);
    const changing = checked.filter((app) => app.changes.length);
    const summaryElement = document.createElement("p");
    summaryElement.classList.add("upgrade-check-summary");
    summaryElement.textContent = changing.length
        ? `${changing.length} of ${checked.length} checked ${pluralize(checked.length, "app")} would draw differently with the local build.`
        : `Every checked app draws the same with the local build, ${checked.length} ${pluralize(checked.length, "app")}.`;
    resultsElement.appendChild(summaryElement);

    for (const app of changing) {
        const detailsElement = document.createElement("details");
        detailsElement.classList.add("upgrade-check-app");
        const summary = document.createElement("summary");
        summary.textContent = `${app.appOwner}/${app.appName}, installed ${app.version}: ${app.changes.length} of ${app.drawings} ${pluralize(app.drawings, "drawing")} change`;
        detailsElement.appendChild(summary);
        const listElement = document.createElement("ul");
        for (const change of app.changes) {
            const itemElement = document.createElement("li");
            const linkElement = document.createElement("a");
            linkElement.href = change.link;
            linkElement.textContent = `${change.formName}, ${change.fileName ?? "no example file"}`;
            itemElement.append(linkElement, `: ${change.components.join(", ")}`);
            listElement.appendChild(itemElement);
        }
        detailsElement.appendChild(listElement);
        resultsElement.appendChild(detailsElement);
    }

    const lines: [string, UpgradeScanApp[]][] = [
        ["Draw the same", checked.filter((app) => !app.changes.length)],
        ["Not checked, the installed version could not be loaded", result.apps.filter((app) => app.unavailable)],
        ["Not checked, the installed version is not known", result.apps.filter((app) => !app.version)]
    ];
    for (const [label, apps] of lines) {
        if (!apps.length) continue;
        const lineElement = document.createElement("p");
        lineElement.classList.add("upgrade-check-others");
        lineElement.textContent = `${label}: ${apps.map((app) => `${app.appOwner}/${app.appName}${app.version ? ` (${app.version})` : ""}`).join(", ")}`;
        resultsElement.appendChild(lineElement);
    }
}
