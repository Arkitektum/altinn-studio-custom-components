import type { ApiValue, DisplayLayoutEntry, LayoutComponent } from "../types.ts";
// Local functions
import { fetchAltinnStudioForms, fetchExampleData } from "./apiHelpers.ts";
import { findExampleDataForApp, getDataModelsForApp } from "./renderers.ts";
import { applyTextResourcesForLanguage } from "./textResourceLanguage.ts";
import { drawLayoutComponents } from "./drawComponents.ts";
import { pluralize } from "../formatters.ts";

/** One drawing of a form: an app's display layout or subform, with one of its example files. */
export interface RenderTarget {
    appOwner: string;
    appName: string;
    formName: string;
    components: (LayoutComponent | undefined)[];
    dataModels: ApiValue[];
    /** The data type text bindings are read from, as on the display layouts page. */
    dataType: string | undefined;
    fileNames: Record<string, string>;
    /** The example file it is drawn with, undefined when the form's data type has none. */
    fileName: string | undefined;
}

/** A component that could not be drawn, and showed the render error notice instead. */
export interface RenderFailure {
    appOwner: string;
    appName: string;
    formName: string;
    fileName: string | undefined;
    /** The tag name of the component that failed. */
    component: string;
    componentId: string;
    /** The id, or tag name, of the component in the form's layout that it is part of. */
    layoutComponent: string;
    /** The name and message of what it threw, or "" when it could not be told. */
    error: string;
}

export interface RenderHealthResult {
    failures: RenderFailure[];
    drawings: number;
    /** When the data that was checked was synchronized. */
    lastUpdated: string | number | undefined;
}

/**
 * Every drawing the check makes: each display layout and subform of each app, once for each example file of the form's data type, or once without data when there is none.
 *
 * @param {Array} displayLayouts - The apps' display layouts, as synchronized.
 * @param {Array} exampleData - The apps' example data, as synchronized.
 * @param {Array} altinnStudioForms - The apps and their main data types.
 * @returns {RenderTarget[]} The drawings, app by app.
 */
export function getRenderTargets(
    displayLayouts: DisplayLayoutEntry[] | undefined,
    exampleData: ApiValue,
    altinnStudioForms: ApiValue[] | undefined
): RenderTarget[] {
    const targets: RenderTarget[] = [];
    for (const app of displayLayouts || []) {
        const appOwner = String(app.appOwner);
        const appName = String(app.appName);
        const dataModels = getDataModelsForApp(exampleData, app);
        const dataType = altinnStudioForms?.find((form: ApiValue) => form.appOwner === appOwner && form.appName === appName)?.dataType;
        const forms = [
            ...(app.displayLayouts || []).map((layout: ApiValue) => ({
                formName: layout?.name,
                formDataType: app.dataType,
                components: layout?.layout?.data?.layout
            })),
            ...(app.subForms || []).map((subForm: ApiValue) => ({
                formName: subForm?.appName,
                formDataType: subForm?.dataType,
                components: subForm?.layout?.data?.layout
            }))
        ];
        for (const { formName, formDataType, components } of forms) {
            if (!Array.isArray(components) || !components.length) continue;
            const fileNames: string[] = findExampleDataForApp(exampleData, app, formDataType)?.files?.map((file: ApiValue) => file.name) ?? [];
            const files = fileNames.length ? fileNames : [undefined];
            for (const fileName of files) {
                targets.push({
                    appOwner,
                    appName,
                    formName: String(formName),
                    components,
                    dataModels,
                    dataType,
                    fileNames: fileName ? { [formDataType]: fileName } : {},
                    fileName
                });
            }
        }
    }
    return targets;
}

function describeError(error: unknown) {
    if (error === undefined) return "";
    return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

const RENDER_ERROR_LOG = /^Could not render <([^>]+)>(?: \(id '(.*)'\))?\.$/;

/**
 * Draws one form in the given element, which must be in the document, and lists the components that showed the render error notice. The element is emptied afterwards.
 *
 * What each failure threw is taken from the line the component logs as it fails, which is kept off the console while the form is drawn.
 *
 * @param {RenderTarget} target - The drawing.
 * @param {HTMLElement} hostElement - Where to draw it.
 * @returns {RenderFailure[]} The components that could not be drawn.
 */
export function checkRenderTarget(target: RenderTarget, hostElement: HTMLElement): RenderFailure[] {
    const { appOwner, appName, formName, fileName } = target;
    const failure = (component: string, componentId: string, layoutComponent: string, error: unknown): RenderFailure => ({
        appOwner,
        appName,
        formName,
        fileName,
        component,
        componentId,
        layoutComponent,
        error: describeError(error)
    });
    const logged: { key: string; error: unknown }[] = [];
    const { error: consoleError } = console;
    console.error = (...args: unknown[]) => {
        const match = RENDER_ERROR_LOG.exec(String(args[0]));
        if (match) {
            logged.push({ key: `${match[1]}#${match[2] ?? ""}`, error: args[1] });
        } else {
            consoleError(...args);
        }
    };
    try {
        let drawn: ReturnType<typeof drawLayoutComponents>;
        try {
            drawn = drawLayoutComponents(target.components, target.dataModels, target.dataType, target.fileNames);
        } catch (error) {
            return [failure("(the whole form)", "", "", error)];
        }
        hostElement.append(...drawn.map(({ element }) => element));
        return Array.from(hostElement.querySelectorAll(".custom-component-render-error")).map((notice) => {
            const host = notice.parentElement;
            const component = host?.tagName.toLowerCase() ?? "";
            const componentId = host?.id ?? "";
            const layoutComponent = drawn.find(({ element }) => element.contains(notice))?.component;
            const index = logged.findIndex(({ key }) => key === `${component}#${componentId}`);
            const error = index === -1 ? undefined : logged.splice(index, 1)[0]!.error;
            return failure(component, componentId, layoutComponent?.id || layoutComponent?.tagName || "", error);
        });
    } finally {
        console.error = consoleError;
        hostElement.replaceChildren();
    }
}

/**
 * Draws every form, one at a time, with the app's own nb text resources, giving the page a chance to show progress between them.
 *
 * @param {RenderTarget[]} targets - The drawings.
 * @param {Function} onProgress - Called with how many are drawn, and how many there are, after each.
 * @returns {Promise<RenderFailure[]>} Every component that could not be drawn.
 */
export async function runRenderHealthCheck(targets: RenderTarget[], onProgress: (done: number, total: number) => void = () => {}) {
    const hostElement = document.createElement("div");
    hostElement.hidden = true;
    hostElement.setAttribute("aria-hidden", "true");
    hostElement.classList.add("render-health-drawing");
    document.body.appendChild(hostElement);
    const failures: RenderFailure[] = [];
    let appliedFor = "";
    try {
        for (const [index, target] of targets.entries()) {
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
            failures.push(...checkRenderTarget(target, hostElement));
            onProgress(index + 1, targets.length);
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    } finally {
        hostElement.remove();
    }
    return failures;
}

let lastResult: RenderHealthResult | null = null;
let running = false;

/**
 * Renders the render health page: a button that draws every form with every example file, and what the last check found.
 *
 * @param {HTMLElement} containerElement - The element the page is drawn in.
 */
export function renderRenderHealthPage(containerElement: HTMLElement) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Render health";

    const paperElement = document.createElement("div");
    paperElement.classList.add("paper", "render-health");
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent =
        'Draws every app\'s display layouts and subforms with each of their example files, out of sight, and lists every component that showed "Denne delen kunne ikke vises." instead of its content.';

    const controlsElement = document.createElement("div");
    controlsElement.classList.add("render-health-controls");
    const buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.id = "render-health-check-button";
    const progressElement = document.createElement("span");
    progressElement.id = "render-health-progress";
    progressElement.setAttribute("role", "status");
    controlsElement.append(buttonElement, progressElement);

    const resultsElement = document.createElement("div");
    resultsElement.id = "render-health-results";

    const showRunning = (isRunning: boolean) => {
        buttonElement.disabled = isRunning;
        buttonElement.textContent = isRunning ? "Checking…" : "Check all apps";
    };
    showRunning(running);
    renderRenderHealthResults(resultsElement, lastResult);

    buttonElement.onclick = async () => {
        if (running) return;
        running = true;
        showRunning(true);
        progressElement.textContent = "Loading the example data…";
        try {
            const exampleData = globalThis.exampleData || (await fetchExampleData());
            const altinnStudioForms = globalThis.altinnStudioForms || (await fetchAltinnStudioForms());
            globalThis.exampleData = exampleData;
            globalThis.altinnStudioForms = altinnStudioForms;
            const lastUpdated = globalThis.lastUpdated;
            const targets = getRenderTargets(globalThis.displayLayouts, exampleData, altinnStudioForms);
            const failures = await runRenderHealthCheck(targets, (done, total) => {
                const currentProgressElement = document.getElementById("render-health-progress");
                if (currentProgressElement) currentProgressElement.textContent = `Drew ${done} of ${total} ${pluralize(total, "form")}`;
            });
            lastResult = { failures, drawings: targets.length, lastUpdated };
            const currentResultsElement = document.getElementById("render-health-results");
            if (currentResultsElement) renderRenderHealthResults(currentResultsElement, lastResult);
            const currentProgressElement = document.getElementById("render-health-progress");
            if (currentProgressElement) currentProgressElement.textContent = "";
        } catch (error) {
            console.error("Could not check the apps:", error);
            const currentProgressElement = document.getElementById("render-health-progress");
            if (currentProgressElement) currentProgressElement.textContent = "The check could not finish. The console says why.";
        } finally {
            running = false;
            const currentButtonElement = document.getElementById("render-health-check-button") as HTMLButtonElement | null;
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
 * Shows what a check found: a summary, and a table of the components that could not be drawn. Says so when the data has been synchronized since.
 *
 * @param {HTMLElement} resultsElement - Where to show it.
 * @param {RenderHealthResult|null} result - What the last check found, null before the first.
 */
export function renderRenderHealthResults(resultsElement: HTMLElement, result: RenderHealthResult | null) {
    resultsElement.replaceChildren();
    if (!result) return;
    if (result.lastUpdated !== globalThis.lastUpdated) {
        const staleElement = document.createElement("p");
        staleElement.classList.add("render-health-stale");
        staleElement.textContent = "These results are from before the last synchronization. Check again to see the current data.";
        resultsElement.appendChild(staleElement);
    }
    const summaryElement = document.createElement("p");
    summaryElement.classList.add("render-health-summary");
    const failedDrawings = new Set(
        result.failures.map(({ appOwner, appName, formName, fileName }) => `${appOwner}/${appName}/${formName}/${fileName}`)
    ).size;
    summaryElement.textContent = result.failures.length
        ? `${result.failures.length} ${pluralize(result.failures.length, "component")} could not be drawn, in ${failedDrawings} of ${result.drawings} ${pluralize(result.drawings, "drawing")}.`
        : `Every component was drawn, in ${result.drawings} ${pluralize(result.drawings, "drawing")}.`;
    resultsElement.appendChild(summaryElement);
    if (!result.failures.length) return;

    const tableElement = document.createElement("table");
    tableElement.classList.add("render-health-failures");
    const headRowElement = tableElement.createTHead().insertRow();
    for (const heading of ["App", "Form", "Example file", "Component", "Error"]) {
        const cellElement = document.createElement("th");
        cellElement.scope = "col";
        cellElement.textContent = heading;
        headRowElement.appendChild(cellElement);
    }
    const bodyElement = tableElement.createTBody();
    for (const failure of result.failures) {
        const rowElement = bodyElement.insertRow();
        const component = `<${failure.component}>${failure.componentId ? ` ${failure.componentId}` : ""}`;
        const partOf = failure.layoutComponent && failure.layoutComponent !== failure.componentId ? `, in ${failure.layoutComponent}` : "";
        for (const text of [
            `${failure.appOwner}/${failure.appName}`,
            failure.formName,
            failure.fileName ?? "None",
            `${component}${partOf}`,
            failure.error || "Not logged"
        ]) {
            rowElement.insertCell().textContent = text;
        }
    }
    resultsElement.appendChild(tableElement);
}
