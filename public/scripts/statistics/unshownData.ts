import type { ApiValue } from "../types.ts";
import type { RenderTarget } from "./renderHealth.ts";
// Local functions
import { fetchAltinnStudioForms, fetchExampleData } from "./apiHelpers.ts";
import { applyTextResourcesForLanguage } from "./textResourceLanguage.ts";
import { drawLayoutComponents } from "./drawComponents.ts";
import { getRenderTargets } from "./renderHealth.ts";

/**
 * Finds the example data no component reads. Each form is drawn, out of sight, with its example data behind a proxy that records which values are read, and the values that are never read are listed.
 */

/** The functions `hasValue` walks an object or array with. A read made inside them only checks whether something is empty, and does not show the value. */
const EMPTINESS_CHECKS = /\b(objectHasContent|arrayHasContent)\b/;

/**
 * The paths of the values in example data, with array positions written as `[]`, e.g. `parter[].navn`. Empty strings and nulls are not values.
 *
 * @param {*} data - The example data.
 * @param {string} [path] - The path of `data` itself.
 * @param {Set<string>} [paths] - Where to add the paths.
 * @returns {Set<string>} The paths.
 */
export function getDataValuePaths(data: unknown, path = "", paths: Set<string> = new Set()) {
    if (Array.isArray(data)) {
        for (const item of data) getDataValuePaths(item, `${path}[]`, paths);
    } else if (data !== null && typeof data === "object") {
        for (const [key, value] of Object.entries(data)) getDataValuePaths(value, path ? `${path}.${key}` : key, paths);
    } else if (data !== null && data !== undefined && data !== "") {
        paths.add(path);
    }
    return paths;
}

type Template = string | { [key: string]: Template };

/**
 * Starts recording which values of the data handed to `wrap` are read. Form data reaches a component as a JSON attribute, so while recording, `JSON.stringify` remembers which data went into each string without recording what it reads, and `JSON.parse` of such a string hands back the data wrapped again.
 *
 * @returns {{ wrap: Function, reads: Set<string>, stop: Function }} `wrap` puts data behind the recording proxy, `reads` collects the paths read, and `stop` gives JSON back.
 */
export function startRecordingReads() {
    const reads: Set<string> = new Set();
    const proxyPaths: WeakMap<object, string> = new WeakMap();
    const proxies: WeakMap<object, Map<string, object>> = new WeakMap();
    const templates: Map<string, Template> = new Map();
    let paused = 0;

    function wrap(value: unknown, path: string): unknown {
        if (value === null || typeof value !== "object" || proxyPaths.has(value)) return value;
        let byPath = proxies.get(value);
        if (!byPath) {
            byPath = new Map();
            proxies.set(value, byPath);
        }
        const existing = byPath.get(path);
        if (existing) return existing;
        const proxy = new Proxy(value, {
            get(target, key, receiver) {
                const child = Reflect.get(target, key, receiver);
                const isArray = Array.isArray(target);
                if (typeof key !== "string" || !Object.hasOwn(target, key) || (isArray && key === "length")) return child;
                const childPath = isArray ? `${path}[]` : path ? `${path}.${key}` : key;
                if (!paused && (child === null || typeof child !== "object") && !EMPTINESS_CHECKS.test(new Error().stack ?? "")) {
                    reads.add(childPath);
                }
                return wrap(child, childPath);
            }
        });
        proxyPaths.set(proxy, path);
        byPath.set(path, proxy);
        return proxy;
    }

    function templateOf(value: unknown, depth = 0): Template | undefined {
        if (value === null || typeof value !== "object") return undefined;
        const path = proxyPaths.get(value);
        if (path !== undefined) return path;
        if (depth > 3) return undefined;
        const children: Record<string, Template> = {};
        for (const key of Object.keys(value)) {
            const template = templateOf((value as Record<string, unknown>)[key], depth + 1);
            if (template !== undefined) children[key] = template;
        }
        return Object.keys(children).length ? children : undefined;
    }

    function applyTemplate(value: unknown, template: Template): unknown {
        if (typeof template === "string") return wrap(value, template);
        if (value !== null && typeof value === "object") {
            for (const [key, childTemplate] of Object.entries(template)) {
                (value as Record<string, unknown>)[key] = applyTemplate((value as Record<string, unknown>)[key], childTemplate);
            }
        }
        return value;
    }

    const { stringify, parse } = JSON;
    JSON.stringify = function (...args: Parameters<typeof stringify>) {
        paused++;
        try {
            const result = stringify.apply(JSON, args);
            const template = templateOf(args[0]);
            if (template !== undefined && typeof result === "string") templates.set(result, template);
            return result;
        } finally {
            paused--;
        }
    } as typeof stringify;
    JSON.parse = function (...args: Parameters<typeof parse>) {
        const parsed = parse.apply(JSON, args);
        const template = typeof args[0] === "string" ? templates.get(args[0]) : undefined;
        return template === undefined ? parsed : applyTemplate(parsed, template);
    } as typeof parse;

    return {
        wrap,
        reads,
        stop() {
            JSON.stringify = stringify;
            JSON.parse = parse;
        }
    };
}

/**
 * Draws one form with one example file in the given element, which must be in the document, recording which values of that file are read. The element is emptied afterwards.
 *
 * @param {RenderTarget} target - The drawing. Only the form's own data type is recorded.
 * @param {HTMLElement} hostElement - Where to draw it.
 * @returns {{ dataType: string, values: Set<string>, reads: Set<string> } | null} The paths of the file's values, and of those read, or null when the drawing has no example file.
 */
export function recordReadsForTarget(target: RenderTarget, hostElement: HTMLElement) {
    const [dataType, fileName] = Object.entries(target.fileNames)[0] ?? [];
    if (!dataType || !fileName) return null;
    const dataModel = target.dataModels.find((model: ApiValue) => model.dataType === dataType);
    const fileData = dataModel?.data?.[fileName];
    const values = getDataValuePaths(fileData);
    const recording = startRecordingReads();
    const { error: consoleError, warn: consoleWarn } = console;
    // A failure is the render health page's business. Here it only means fewer values were read.
    console.error = () => {};
    console.warn = () => {};
    try {
        const dataModels = target.dataModels.map((model: ApiValue) =>
            model === dataModel ? { ...model, data: { ...model.data, [fileName]: recording.wrap(fileData, "") } } : model
        );
        try {
            const drawn = drawLayoutComponents(target.components, dataModels, target.dataType, target.fileNames);
            hostElement.append(...drawn.map(({ element }) => element));
        } catch {
            // A form that cannot be drawn reads nothing more.
        }
    } finally {
        recording.stop();
        console.error = consoleError;
        console.warn = consoleWarn;
        hostElement.replaceChildren();
    }
    return { dataType, values, reads: recording.reads };
}

/** A form's example data values that no component read, with how many of its example files have each. */
export interface UnshownDataForForm {
    appOwner: string;
    appName: string;
    formName: string;
    dataType: string;
    files: number;
    values: number;
    unshown: { path: string; files: number }[];
}

export interface UnshownDataResult {
    forms: UnshownDataForForm[];
    lastUpdated: string | number | undefined;
}

/**
 * Draws every form with each of its example files, one at a time, and collects for each form the values no component read in any of them.
 *
 * @param {RenderTarget[]} targets - The drawings. Those without an example file are skipped, and not counted in the progress.
 * @param {Function} [onProgress] - Called with how many are drawn, and how many there are, after each.
 * @returns {Promise<UnshownDataForForm[]>} Each form with an example file, in the order of the drawings.
 */
export async function runUnshownDataCheck(targets: RenderTarget[], onProgress: (done: number, total: number) => void = () => {}) {
    const hostElement = document.createElement("div");
    hostElement.hidden = true;
    hostElement.setAttribute("aria-hidden", "true");
    hostElement.classList.add("unshown-data-drawing");
    document.body.appendChild(hostElement);
    const forms: Map<string, { form: Omit<UnshownDataForForm, "unshown" | "values">; valueFiles: Map<string, number>; read: Set<string> }> =
        new Map();
    let appliedFor = "";
    // A drawing without an example file has nothing to record, so it is not drawn or counted.
    const drawable = targets.filter(({ fileName }) => fileName !== undefined);
    try {
        for (const [index, target] of drawable.entries()) {
            const app = `${target.appOwner}/${target.appName}`;
            if (app !== appliedFor) {
                applyTextResourcesForLanguage(
                    globalThis.multilingualDefaultTextResources,
                    globalThis.multilingualAppResourceValues,
                    "nb",
                    target.appOwner,
                    target.appName
                );
                appliedFor = app;
            }
            const recorded = recordReadsForTarget(target, hostElement);
            if (recorded) {
                const key = `${app}/${target.formName}`;
                let entry = forms.get(key);
                if (!entry) {
                    entry = {
                        form: {
                            appOwner: target.appOwner,
                            appName: target.appName,
                            formName: target.formName,
                            dataType: recorded.dataType,
                            files: 0
                        },
                        valueFiles: new Map(),
                        read: new Set()
                    };
                    forms.set(key, entry);
                }
                entry.form.files++;
                for (const path of recorded.values) entry.valueFiles.set(path, (entry.valueFiles.get(path) ?? 0) + 1);
                for (const path of recorded.reads) entry.read.add(path);
            }
            onProgress(index + 1, drawable.length);
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    } finally {
        hostElement.remove();
    }
    return [...forms.values()].map(({ form, valueFiles, read }) => ({
        ...form,
        values: valueFiles.size,
        unshown: [...valueFiles.entries()]
            .filter(([path]) => !read.has(path))
            .map(([path, files]) => ({ path, files }))
            .sort((a, b) => a.path.localeCompare(b.path))
    }));
}

let lastResult: UnshownDataResult | null = null;
let running = false;

/**
 * Renders the unshown data page: a button that draws every form with every example file, and the values the last check found no component reading.
 *
 * @param {HTMLElement} containerElement - The element the page is drawn in.
 */
export function renderUnshownDataPage(containerElement: HTMLElement) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Unshown data";

    const paperElement = document.createElement("div");
    paperElement.classList.add("paper", "unshown-data");
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent =
        "Draws every app's display layouts and subforms with each of their example files, out of sight, and lists the values in the example data that no component read. A value only checked for being empty counts as not read. Forms without example data are left out.";

    const controlsElement = document.createElement("div");
    controlsElement.classList.add("render-health-controls");
    const buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.id = "unshown-data-check-button";
    const progressElement = document.createElement("span");
    progressElement.id = "unshown-data-progress";
    progressElement.setAttribute("role", "status");
    controlsElement.append(buttonElement, progressElement);

    const resultsElement = document.createElement("div");
    resultsElement.id = "unshown-data-results";

    const showRunning = (isRunning: boolean) => {
        buttonElement.disabled = isRunning;
        buttonElement.textContent = isRunning ? "Checking…" : "Check all apps";
    };
    showRunning(running);
    renderUnshownDataResults(resultsElement, lastResult);

    buttonElement.onclick = async () => {
        if (running) return;
        running = true;
        showRunning(true);
        progressElement.textContent = "Loading the example data…";
        const setProgress = (text: string) => {
            const currentProgressElement = document.getElementById("unshown-data-progress");
            if (currentProgressElement) currentProgressElement.textContent = text;
        };
        try {
            const exampleData = globalThis.exampleData || (await fetchExampleData());
            const altinnStudioForms = globalThis.altinnStudioForms || (await fetchAltinnStudioForms());
            globalThis.exampleData = exampleData;
            globalThis.altinnStudioForms = altinnStudioForms;
            const lastUpdated = globalThis.lastUpdated;
            const targets = getRenderTargets(globalThis.displayLayouts, exampleData, altinnStudioForms);
            const forms = await runUnshownDataCheck(targets, (done, total) => setProgress(`Drew ${done} of ${total} forms`));
            lastResult = { forms, lastUpdated };
            const currentResultsElement = document.getElementById("unshown-data-results");
            if (currentResultsElement) renderUnshownDataResults(currentResultsElement, lastResult);
            setProgress("");
        } catch (error) {
            console.error("Could not check the apps:", error);
            setProgress("The check could not finish. The console says why.");
        } finally {
            running = false;
            const currentButtonElement = document.getElementById("unshown-data-check-button") as HTMLButtonElement | null;
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
 * Shows what a check found: a summary, and for each form with unshown values, a foldable list of their paths with how many example files have each. Says so when the data has been synchronized since.
 *
 * @param {HTMLElement} resultsElement - Where to show it.
 * @param {UnshownDataResult|null} result - What the last check found, null before the first.
 */
export function renderUnshownDataResults(resultsElement: HTMLElement, result: UnshownDataResult | null) {
    resultsElement.replaceChildren();
    if (!result) return;
    if (result.lastUpdated !== globalThis.lastUpdated) {
        const staleElement = document.createElement("p");
        staleElement.classList.add("render-health-stale");
        staleElement.textContent = "These results are from before the last synchronization. Check again to see the current data.";
        resultsElement.appendChild(staleElement);
    }
    const formsWithUnshown = result.forms.filter(({ unshown }) => unshown.length);
    const unshownCount = formsWithUnshown.reduce((count, { unshown }) => count + unshown.length, 0);
    const summaryElement = document.createElement("p");
    summaryElement.classList.add("unshown-data-summary");
    summaryElement.textContent = unshownCount
        ? `${unshownCount} ${unshownCount === 1 ? "value is" : "values are"} never shown, in ${formsWithUnshown.length} of ${result.forms.length} forms.`
        : `Every value in the example data is shown, in ${result.forms.length} ${result.forms.length === 1 ? "form" : "forms"}.`;
    resultsElement.appendChild(summaryElement);

    for (const form of formsWithUnshown) {
        const detailsElement = document.createElement("details");
        detailsElement.classList.add("unshown-data-form");
        const summary = document.createElement("summary");
        summary.textContent = `${form.appOwner}/${form.appName}, ${form.formName} (${form.dataType}): ${form.unshown.length} of ${form.values} values never shown`;
        detailsElement.appendChild(summary);
        const listElement = document.createElement("ul");
        for (const { path, files } of form.unshown) {
            const itemElement = document.createElement("li");
            const pathElement = document.createElement("code");
            pathElement.textContent = path;
            itemElement.append(pathElement, ` in ${files} of ${form.files} example ${form.files === 1 ? "file" : "files"}`);
            listElement.appendChild(itemElement);
        }
        detailsElement.appendChild(listElement);
        resultsElement.appendChild(detailsElement);
    }
}
