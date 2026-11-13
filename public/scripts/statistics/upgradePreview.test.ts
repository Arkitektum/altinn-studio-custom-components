import {
    DIFFERS_CLASS,
    MIN_COMPARISON_SCALE,
    buildPreviewDocument,
    compareDrawnComponents,
    createFrame,
    drawnOutput,
    fitComparison,
    getComparisonScale,
    getFrameWidth,
    getInstalledVersion,
    getPageOrientation,
    renderUpgradePreview,
    sizeFramesAsPages
} from "./upgradePreview.ts";
import { getPackageFileUrl } from "./apiHelpers.ts";

describe("getInstalledVersion", () => {
    const packageVersions = [
        { appOwner: "dibk", appName: "et-v4", packageVersions: { altinnStudioCustomComponents: "17.2.0" } },
        { appOwner: "dibk", appName: "rs-v4", packageVersions: { altinnStudioCustomComponents: "^17.0.0" } },
        { appOwner: "dibk", appName: "ta-v4", packageVersions: {} }
    ];
    it("reads the version the app has installed", () => {
        expect(getInstalledVersion(packageVersions, "dibk", "et-v4")).toBe("17.2.0");
    });
    it("knows no version that is not a full version number, nor one for an app without any", () => {
        expect(getInstalledVersion(packageVersions, "dibk", "rs-v4")).toBeUndefined();
        expect(getInstalledVersion(packageVersions, "dibk", "ta-v4")).toBeUndefined();
        expect(getInstalledVersion(packageVersions, "dibk", "unknown")).toBeUndefined();
        expect(getInstalledVersion(undefined, "dibk", "et-v4")).toBeUndefined();
    });
});

describe("buildPreviewDocument", () => {
    const options = {
        scriptUrl: "http://localhost:9001/api/packageFiles/17.2.0/main.js",
        styleUrl: "http://localhost:9001/api/packageFiles/17.2.0/main.css",
        textResources: { language: "nb", resources: [{ id: "app.title", value: "</script><script>alert(1)</script>" }] },
        defaultTextResources: { language: "nb", resources: [] },
        language: "nb",
        componentsHtml: '<div><custom-field-data id="tittel"></custom-field-data></div>',
        allowedOrigins: ["http://localhost:9000", "http://localhost:9001"]
    };
    const parse = (html: string) => new DOMParser().parseFromString(html, "text/html");

    it("lets the frame load only from the dev server and -api, and fetch nothing", () => {
        const policy = parse(buildPreviewDocument(options)).querySelector('meta[http-equiv="Content-Security-Policy"]')!.getAttribute("content")!;
        expect(policy).toBe(
            "default-src 'none'; script-src 'unsafe-inline' http://localhost:9000 http://localhost:9001; style-src 'unsafe-inline' http://localhost:9000 http://localhost:9001; font-src data: http://localhost:9000 http://localhost:9001; img-src data: http://localhost:9000 http://localhost:9001; connect-src 'none'"
        );
    });
    it("lets the frame's scripts evaluate strings only when asked to, as the dev server's build needs", () => {
        const scriptSource = (html: string) =>
            parse(html)
                .querySelector('meta[http-equiv="Content-Security-Policy"]')!
                .getAttribute("content")!
                .split("; ")
                .find((directive) => directive.startsWith("script-src"));
        expect(scriptSource(buildPreviewDocument({ ...options, allowEval: true }))).toBe(
            "script-src 'unsafe-inline' 'unsafe-eval' http://localhost:9000 http://localhost:9001"
        );
        expect(scriptSource(buildPreviewDocument({ ...options, allowEval: false }))).toBe(
            "script-src 'unsafe-inline' http://localhost:9000 http://localhost:9001"
        );
    });
    it("draws the form on a white page with the single page view's margins", () => {
        const css = parse(buildPreviewDocument(options)).querySelector("head style")!.textContent!;
        expect(css).toContain("html, body { margin: 0; background: #fff; }");
        expect(css).toContain("#preview-components { box-sizing: border-box; padding: 1cm 1.25cm; }");
    });
    it("loads the version's styles, and its script after the form's elements so they are defined in place", () => {
        const preview = parse(buildPreviewDocument(options));
        expect(preview.querySelector('link[rel="stylesheet"]')!.getAttribute("href")).toBe(options.styleUrl);
        const scripts = Array.from(preview.querySelectorAll("script"));
        expect(scripts[scripts.length - 1]!.getAttribute("src")).toBe(options.scriptUrl);
        expect(preview.querySelector("#preview-components")!.innerHTML).toBe(options.componentsHtml);
        expect(preview.querySelector("#preview-components")!.nextElementSibling).toBe(scripts[scripts.length - 1]!);
    });
    it("puts the text resources where the current and older versions read them, and keeps them from ending the script", () => {
        const preview = parse(buildPreviewDocument(options));
        const inline = preview.querySelector("head script")!.textContent!;
        expect(preview.querySelectorAll("script")).toHaveLength(2);
        const frameGlobals: Record<string, unknown> = {};
        new Function("globalThis", inline)(frameGlobals);
        expect(frameGlobals.textResources).toEqual(options.textResources);
        expect(frameGlobals.defaultTextResources).toEqual(options.defaultTextResources);
        expect(frameGlobals.selectedLanguage).toBe("nb");
        expect(frameGlobals.appConfig).toEqual({
            selectedLanguage: "nb",
            textResources: options.textResources,
            defaultTextResources: options.defaultTextResources
        });
    });
    it("escapes what it puts in attributes", () => {
        const preview = parse(buildPreviewDocument({ ...options, styleUrl: 'x"><script>alert(1)</script>', language: 'nb"' }));
        expect(preview.querySelector('link[rel="stylesheet"]')!.getAttribute("href")).toBe('x"><script>alert(1)</script>');
        expect(preview.documentElement.getAttribute("lang")).toBe('nb"');
        expect(preview.querySelectorAll("script")).toHaveLength(2);
    });
});

describe("drawnOutput", () => {
    const element = (html: string) => {
        const container = document.createElement("div");
        container.innerHTML = html;
        return container;
    };
    it("evens out whitespace between and inside elements", () => {
        expect(drawnOutput(element("<p>a   b</p>\n  <p>c</p>"))).toBe(drawnOutput(element("<p>a b</p><p>c</p>")));
    });
    it("numbers generated ids, and the references to them, so two drawings match", () => {
        const first = element('<span id="field-abc123" class="t">A</span><span aria-labelledby="field-abc123 other-x">B</span><i id="other-x"></i>');
        const second = element('<span id="field-zzz999" class="t">A</span><span aria-labelledby="field-zzz999 other-y">B</span><i id="other-y"></i>');
        expect(drawnOutput(first)).toBe(drawnOutput(second));
        expect(drawnOutput(first)).toBe('<span id="id-1" class="t">A</span><span aria-labelledby="id-1 id-2">B</span><i id="id-2"></i>');
    });
    it("still tells apart output that differs in more than its ids", () => {
        expect(drawnOutput(element('<span id="a">A</span>'))).not.toBe(drawnOutput(element('<span id="b">B</span>')));
        expect(drawnOutput(element('<span id="a" aria-labelledby="a">A</span>'))).not.toBe(drawnOutput(element('<span id="b">A</span>')));
    });
    it("leaves text that only looks like an id alone", () => {
        expect(drawnOutput(element('<span id="x">x marks the spot</span>'))).toBe('<span id="id-1">x marks the spot</span>');
    });
});

describe("compareDrawnComponents", () => {
    const frameDocument = (components: string[]) => {
        const preview = document.implementation.createHTMLDocument();
        preview.body.innerHTML = `<div id="preview-components">${components.map((html) => `<div>${html}</div>`).join("")}</div>`;
        return preview;
    };
    it("marks the components whose output differs, in both drawings", () => {
        const installed = frameDocument(["<p>same</p>", "<p>old</p>", '<p id="r1">same id</p>']);
        const local = frameDocument(["<p>same</p>", "<p>new</p>", '<p id="r2">same id</p>']);
        expect(compareDrawnComponents(installed, local)).toEqual({ differing: [1], total: 3 });
        const marked = (preview: Document) => Array.from(preview.querySelectorAll(`.${DIFFERS_CLASS}`)).map((node) => node.textContent);
        expect(marked(installed)).toEqual(["old"]);
        expect(marked(local)).toEqual(["new"]);
    });
    it("counts a component only one of them drew as different", () => {
        expect(compareDrawnComponents(frameDocument(["<p>a</p>"]), frameDocument(["<p>a</p>", "<p>b</p>"]))).toEqual({ differing: [1], total: 2 });
    });
});

describe("renderUpgradePreview", () => {
    const originalFetch = globalThis.fetch;
    const originalError = console.error;
    afterEach(() => {
        globalThis.fetch = originalFetch;
        console.error = originalError;
    });
    it("says so, and draws nothing, when the installed version cannot be loaded", async () => {
        console.error = () => {};
        globalThis.fetch = (async () => ({
            ok: false,
            status: 502,
            json: async () => ({ error: "Failed to fetch package files" })
        })) as unknown as typeof fetch;
        const container = document.createElement("div");
        const result = await renderUpgradePreview(container, {
            version: "17.2.0",
            componentsHtml: "",
            componentNames: [],
            textResources: {},
            localDefaultTextResources: {},
            language: "nb"
        });
        expect(result).toBeNull();
        expect(container.querySelector(".upgrade-preview-status")!.textContent).toBe(
            "Version 17.2.0 could not be loaded from the API. Is it running, and can it reach npm?"
        );
        expect(container.querySelector("iframe")).toBeNull();
    });
    it("asks -api for the installed version's text resources", async () => {
        const asked: string[] = [];
        globalThis.fetch = (async (url: string) => {
            asked.push(String(url));
            return { ok: false, status: 404, json: async () => ({ error: "No such package file" }) };
        }) as unknown as typeof fetch;
        console.error = () => {};
        await renderUpgradePreview(document.createElement("div"), {
            version: "17.2.0",
            componentsHtml: "",
            componentNames: [],
            textResources: {},
            localDefaultTextResources: {},
            language: "nb"
        });
        expect(asked).toEqual([getPackageFileUrl("17.2.0", "resource.nb.json")]);
        expect(asked[0]!.endsWith("/api/packageFiles/17.2.0/resource.nb.json")).toBe(true);
    });
});

describe("getPageOrientation", () => {
    it("is landscape when any frame's components asked for it, as gjennomfoeringsplan does", () => {
        expect(getPageOrientation({ pageOrientation: "portrait" } as unknown as Window, { pageOrientation: "landscape" } as unknown as Window)).toBe(
            "landscape"
        );
    });
    it("is portrait otherwise, also for a frame without a window", () => {
        expect(getPageOrientation({} as Window, null)).toBe("portrait");
        expect(getPageOrientation()).toBe("portrait");
    });
});

describe("sizeFramesAsPages", () => {
    it("makes each frame as wide as an A4 page in the orientation, and as tall as what it drew", () => {
        const frames = [document.createElement("iframe"), document.createElement("iframe")];
        frames.forEach((frame) => document.body.appendChild(frame));
        Object.defineProperty(frames[0]!.contentDocument!.documentElement, "scrollHeight", { value: 1200, configurable: true });
        sizeFramesAsPages(frames, "landscape");
        expect(frames.map((frame) => frame.style.width)).toEqual(["29.7cm", "29.7cm"]);
        expect(frames[0]!.style.height).toBe("1204px");
        sizeFramesAsPages(frames, "portrait");
        expect(frames.map((frame) => frame.style.width)).toEqual(["21cm", "21cm"]);
        frames.forEach((frame) => frame.remove());
    });
});

describe("createFrame", () => {
    it("starts as wide as a portrait page, with its title", () => {
        const frame = createFrame("The form drawn with version 17.2.0");
        expect(frame.style.width).toBe("21cm");
        expect(frame.title).toBe("The form drawn with version 17.2.0");
        expect(frame.classList.contains("upgrade-preview-frame")).toBe(true);
    });
});

describe("getFrameWidth", () => {
    it("is a page and its border, in CSS pixels", () => {
        expect(getFrameWidth("portrait")).toBeCloseTo((21 * 96) / 2.54 + 2, 5);
        expect(getFrameWidth("landscape")).toBeCloseTo((29.7 * 96) / 2.54 + 2, 5);
    });
});

describe("getComparisonScale", () => {
    const fullWidth = (orientation: "portrait" | "landscape") => 2 * getFrameWidth(orientation) + 16;
    it("is full size when both frames and the gap fit", () => {
        expect(getComparisonScale(fullWidth("portrait"), "portrait")).toBe(1);
        expect(getComparisonScale(4000, "landscape")).toBe(1);
    });
    it("shrinks the frames, not the gap, just enough to fit", () => {
        const scale = getComparisonScale(1558, "landscape");
        expect(scale).toBeCloseTo((1558 - 16) / (2 * getFrameWidth("landscape")), 5);
        expect(2 * getFrameWidth("landscape") * scale + 16).toBeCloseTo(1558, 5);
    });
    it("never shrinks them below the smallest scale that is still readable", () => {
        expect(MIN_COMPARISON_SCALE).toBe(0.5);
        expect(getComparisonScale(300, "landscape")).toBe(0.5);
    });
    it("is full size when there is no width to go by", () => {
        expect(getComparisonScale(0, "portrait")).toBe(1);
        expect(getComparisonScale(Number.NaN, "portrait")).toBe(1);
    });
});

describe("fitComparison", () => {
    it("zooms the frames' row to fit, and says by how much", () => {
        const columns = document.createElement("div");
        const scale = document.createElement("p");
        fitComparison(columns, scale, 2 * getFrameWidth("portrait") * 0.95 + 16, "portrait");
        expect(Number(columns.style.getPropertyValue("--upgrade-preview-zoom"))).toBeCloseTo(0.95, 5);
        expect(scale.hidden).toBe(false);
        expect(scale.textContent).toBe("Shown at 95% to fit side by side.");
    });
    it("shows full size, and says nothing, once both pages fit again", () => {
        const columns = document.createElement("div");
        const scale = document.createElement("p");
        fitComparison(columns, scale, 800, "portrait");
        fitComparison(columns, scale, 4000, "portrait");
        expect(columns.style.getPropertyValue("--upgrade-preview-zoom")).toBe("");
        expect(scale.hidden).toBe(true);
        expect(scale.textContent).toBe("");
    });
});
