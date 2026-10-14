import { getFormFilterOptions, selectStoredOption, setSelectOptions } from "./displayLayoutHelpers.ts";
import type { ApiValue } from "../types.ts";
import type { DataModelBindingDriftUsage } from "./dataModelBindingHelpers.ts";
import { isSelectedForm } from "../filters.ts";

/** One checked component and the uses of it whose layouts bind other keys than it reads. */
export interface DataModelBindingDriftEntry {
    tagName: string;
    usages: DataModelBindingDriftUsage[];
}

const findingTypes = ["missing", "deprecated", "unknown"] as const;
type FindingType = (typeof findingTypes)[number];

const findingLabels: Record<FindingType, string> = { missing: "Missing", deprecated: "Deprecated", unknown: "Unknown" };

/**
 * Narrows the drift to the filters chosen on the page, which are stored on globalThis.
 *
 * Unlike the component usage list, the uses themselves are narrowed, not only the components: choosing an app lists that app's findings and nobody else's. Choosing a kind of finding keeps only that kind on each use, and drops the uses left with none. Every component stays, so one with nothing left reads as having no drift.
 *
 * @param {Array} drift - The drift for every checked component.
 * @returns {Array} The same components, each with only the uses and findings that pass the filters.
 */
export function filterDataModelBindingDriftBySelectedFilters(drift: DataModelBindingDriftEntry[] | undefined): DataModelBindingDriftEntry[] {
    const appOwner = globalThis.bindingDriftSelectedAppOwner || "";
    const appName = globalThis.bindingDriftSelectedAppName || "";
    const form = globalThis.bindingDriftSelectedForm || "";
    const findingFilter = (globalThis.bindingDriftFindingFilter || "") as FindingType | "";
    return (drift || []).map((component) => ({
        tagName: component.tagName,
        usages: component.usages
            .filter(
                (usage) =>
                    (!appOwner || usage.appOwner === appOwner) && (!appName || usage.appName === appName) && (!form || isSelectedForm(usage, form))
            )
            .map((usage) =>
                findingFilter
                    ? {
                          ...usage,
                          missing: findingFilter === "missing" ? usage.missing : [],
                          deprecated: findingFilter === "deprecated" ? usage.deprecated : [],
                          unknown: findingFilter === "unknown" ? usage.unknown : []
                      }
                    : usage
            )
            .filter((usage) => usage.missing.length || usage.deprecated.length || usage.unknown.length)
    }));
}

/**
 * Creates an element holding the given text, set as text so a name from a layout is never read as markup.
 *
 * @param {string} tagName - The element to create.
 * @param {string} text - Its text.
 * @param {string} [className] - A class to give it.
 * @returns {HTMLElement} The element.
 */
function createTextElement(tagName: string, text: string, className?: string) {
    const element = document.createElement(tagName);
    element.textContent = text;
    if (className) element.classList.add(className);
    return element;
}

/**
 * Creates the summary row of a details element: the expand icon, a title, and counts after it.
 *
 * @param {HTMLElement} titleElement - What the row is about.
 * @param {Array<HTMLElement>} countElements - The counts shown on the right.
 * @returns {HTMLElement} The summary element.
 */
function createSummary(titleElement: HTMLElement, countElements: HTMLElement[]) {
    const summaryElement = document.createElement("summary");
    summaryElement.append(createTextElement("span", "▶", "expand-collapse-icon"), titleElement, ...countElements);
    return summaryElement;
}

/**
 * Describes what a layout binds wrong for one use: one line per kind of finding it has.
 *
 * @param {Object} usage - The use, with its missing, deprecated and unknown keys.
 * @returns {HTMLLIElement} The list item.
 */
export function renderDataModelBindingDriftUsage(usage: DataModelBindingDriftUsage) {
    const usageElement = document.createElement("li");
    usageElement.classList.add("binding-drift-usage");
    usageElement.appendChild(createTextElement("span", usage.id || "(no id)", "binding-drift-usage-id"));
    const findingsElement = document.createElement("dl");
    findingsElement.classList.add("binding-drift-findings");
    const findingTexts: Record<FindingType, string[]> = {
        missing: usage.missing,
        deprecated: usage.deprecated.map(({ key, hint }) => `${key} (${hint})`),
        unknown: usage.unknown
    };
    for (const findingType of findingTypes) {
        if (!findingTexts[findingType].length) continue;
        findingsElement.append(
            createTextElement("dt", findingLabels[findingType], `binding-drift-${findingType}`),
            createTextElement("dd", findingTexts[findingType].join(", "))
        );
    }
    usageElement.appendChild(findingsElement);
    return usageElement;
}

/**
 * Groups uses by app, and within each app by the layout they are in, keeping the order they came in.
 *
 * @param {Array} usages - The uses to group.
 * @returns {Array} `[{ appOwner, appName, layouts: [{ layoutName, subformAppName, usages }] }]`.
 */
function groupUsagesByAppAndLayout(usages: DataModelBindingDriftUsage[]) {
    const apps: Map<string, { appOwner?: string; appName?: string; layouts: Map<string, ApiValue> }> = new Map();
    for (const usage of usages) {
        const appKey = `${usage.appOwner}/${usage.appName}`;
        if (!apps.has(appKey)) apps.set(appKey, { appOwner: usage.appOwner, appName: usage.appName, layouts: new Map() });
        const layouts = apps.get(appKey)!.layouts;
        const layoutKey = `${usage.subformAppName ?? ""}/${usage.layoutName ?? ""}`;
        if (!layouts.has(layoutKey)) layouts.set(layoutKey, { layoutName: usage.layoutName, subformAppName: usage.subformAppName, usages: [] });
        layouts.get(layoutKey).usages.push(usage);
    }
    return [...apps.values()].map((app) => ({ ...app, layouts: [...app.layouts.values()] }));
}

/**
 * Renders one checked component: how many apps and uses bind other keys than it reads, and each of them by app and layout.
 *
 * @param {Object} component - The component and its uses with drift.
 * @returns {HTMLDetailsElement} The list item.
 */
export function renderDataModelBindingDriftListItem(component: DataModelBindingDriftEntry) {
    const listItemElement = document.createElement("details");
    listItemElement.classList.add("component-usage-list-item");

    const tagNameElement = createTextElement("div", component.tagName, "component-tag-name");
    for (const findingType of findingTypes) {
        const useCount = component.usages.filter((usage) => usage[findingType].length).length;
        if (!useCount) continue;
        const indicatorElement = createTextElement("span", `${findingLabels[findingType]}: ${useCount}`, "indicator");
        indicatorElement.title = `Uses with ${findingLabels[findingType].toLowerCase()} keys: ${useCount}`;
        // A missing key leaves out part of what the component shows, so it gets the error colour. The other two are left-overs and get the warning colour.
        indicatorElement.classList.add(findingType === "missing" ? "indicator-missing" : "indicator-deprecated");
        tagNameElement.appendChild(indicatorElement);
    }
    const tagNameContainerElement = document.createElement("div");
    tagNameContainerElement.classList.add("component-tag-name-container");
    tagNameContainerElement.appendChild(tagNameElement);

    const groupedUsages = groupUsagesByAppAndLayout(component.usages);
    const usageContainerElement = document.createElement("div");
    usageContainerElement.classList.add("usage-container");
    usageContainerElement.append(
        createTextElement("span", `Apps: ${groupedUsages.length}`, "app-usage"),
        createTextElement("span", `Components: ${component.usages.length}`, "component-usage")
    );
    listItemElement.appendChild(createSummary(tagNameContainerElement, [usageContainerElement]));

    const usageDetailsElement = document.createElement("div");
    usageDetailsElement.classList.add("usage-details");
    if (!groupedUsages.length) {
        usageDetailsElement.appendChild(createTextElement("span", "No layout binds other keys than this component reads.", "message"));
    } else {
        const appListElement = document.createElement("div");
        appListElement.classList.add("app-usage-details-list");
        for (const app of groupedUsages) {
            const appElement = document.createElement("details");
            const appUseCount = app.layouts.reduce((total: number, layout: ApiValue) => total + layout.usages.length, 0);
            appElement.appendChild(
                createSummary(createTextElement("span", `${app.appOwner}/${app.appName}`, "app-usage-summary-title"), [
                    createTextElement("span", `Components: ${appUseCount}`, "app-usage-summary-count")
                ])
            );
            const layoutListElement = document.createElement("div");
            layoutListElement.classList.add("layout-usage-details-list");
            for (const layout of app.layouts) {
                const layoutElement = document.createElement("details");
                const layoutTitle = layout.subformAppName ? `${layout.subformAppName} (subform)` : layout.layoutName || "DisplayLayout";
                layoutElement.appendChild(
                    createSummary(createTextElement("span", layoutTitle, "layout-usage-summary-title"), [
                        createTextElement("span", `Components: ${layout.usages.length}`, "layout-usage-summary-count")
                    ])
                );
                const usageListElement = document.createElement("ul");
                usageListElement.classList.add("component-usage-list");
                layout.usages.forEach((usage: DataModelBindingDriftUsage) => usageListElement.appendChild(renderDataModelBindingDriftUsage(usage)));
                layoutElement.appendChild(usageListElement);
                layoutListElement.appendChild(layoutElement);
            }
            appElement.appendChild(layoutListElement);
            appListElement.appendChild(appElement);
        }
        usageDetailsElement.appendChild(appListElement);
    }
    listItemElement.appendChild(usageDetailsElement);
    return listItemElement;
}

/**
 * Renders the list of checked components.
 *
 * @param {Array} drift - The components to list.
 * @returns {HTMLDivElement} The list.
 */
export function renderDataModelBindingDriftList(drift: DataModelBindingDriftEntry[]) {
    const listElement = document.createElement("div");
    listElement.id = "binding-drift-list";
    listElement.classList.add("paper");
    drift.forEach((component) => listElement.appendChild(renderDataModelBindingDriftListItem(component)));
    return listElement;
}

/**
 * Draws the list again, filtered by the choices now stored on globalThis.
 *
 * @param {HTMLElement} containerElement - The page, holding the list.
 * @param {Array} drift - The drift for every checked component.
 */
function handleFilterChange(containerElement: HTMLElement, drift: DataModelBindingDriftEntry[] | undefined) {
    containerElement.querySelector("#binding-drift-list")?.remove();
    containerElement.appendChild(renderDataModelBindingDriftList(filterDataModelBindingDriftBySelectedFilters(drift)));
}

/**
 * Creates a labelled select in a `.filter-container`.
 *
 * @param {string} labelText - The label.
 * @param {string} selectId - The select's id.
 * @param {Array<{ value: string, text: string }>} options - The options.
 * @returns {Object} The container and the select.
 */
function createLabelledSelect(labelText: string, selectId: string, options: { value: string; text: string }[]) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("filter-container");
    const labelElement = createTextElement("label", labelText) as HTMLLabelElement;
    labelElement.htmlFor = selectId;
    const selectElement = document.createElement("select");
    selectElement.id = selectId;
    setSelectOptions(selectElement, options, options[0]?.value ?? "");
    containerElement.append(labelElement, selectElement);
    return { containerElement, selectElement };
}

/**
 * Renders the filters for the page: application, form, and kind of finding. Each starts on the choice stored on globalThis when it is still offered.
 *
 * @param {HTMLElement} containerElement - The page, whose list is drawn again on every change.
 * @param {Array} drift - The drift for every checked component.
 * @param {Array} applications - The app entries, which give the applications and their subforms.
 * @returns {Array<HTMLElement>} The filter elements, in the order they are shown.
 */
export function renderDataModelBindingDriftFilters(
    containerElement: HTMLElement,
    drift: DataModelBindingDriftEntry[] | undefined,
    applications: ApiValue
): HTMLElement[] {
    const appOptions = [
        { value: "", text: "All applications" },
        ...(applications || []).map((app: ApiValue) => ({ value: `${app?.appOwner}/${app?.appName}`, text: `${app?.appOwner}/${app?.appName}` }))
    ];
    const application = createLabelledSelect("Application", "binding-drift-application-filter-select", appOptions);
    const storedApp =
        globalThis.bindingDriftSelectedAppOwner && globalThis.bindingDriftSelectedAppName
            ? `${globalThis.bindingDriftSelectedAppOwner}/${globalThis.bindingDriftSelectedAppName}`
            : "";
    if (!selectStoredOption(application.selectElement, storedApp, "")) {
        globalThis.bindingDriftSelectedAppOwner = "";
        globalThis.bindingDriftSelectedAppName = "";
    }

    const formOptions = () => getFormFilterOptions(applications, globalThis.bindingDriftSelectedAppOwner, globalThis.bindingDriftSelectedAppName);
    const form = createLabelledSelect("Form", "binding-drift-form-filter-select", formOptions());
    globalThis.bindingDriftSelectedForm = setSelectOptions(form.selectElement, formOptions(), globalThis.bindingDriftSelectedForm || "");

    const finding = createLabelledSelect("Finding", "binding-drift-finding-filter-select", [
        { value: "", text: "All findings" },
        ...findingTypes.map((findingType) => ({ value: findingType, text: findingLabels[findingType] }))
    ]);
    globalThis.bindingDriftFindingFilter = selectStoredOption(finding.selectElement, globalThis.bindingDriftFindingFilter, "");

    application.selectElement.onchange = () => {
        const [appOwner, appName] = application.selectElement.value.split("/");
        globalThis.bindingDriftSelectedAppOwner = appOwner || "";
        globalThis.bindingDriftSelectedAppName = appName || "";
        // The forms on offer follow the app, as they do on the other pages.
        globalThis.bindingDriftSelectedForm = setSelectOptions(form.selectElement, formOptions(), globalThis.bindingDriftSelectedForm || "");
        handleFilterChange(containerElement, drift);
    };
    form.selectElement.onchange = () => {
        globalThis.bindingDriftSelectedForm = form.selectElement.value;
        handleFilterChange(containerElement, drift);
    };
    finding.selectElement.onchange = () => {
        globalThis.bindingDriftFindingFilter = finding.selectElement.value;
        handleFilterChange(containerElement, drift);
    };
    return [application.containerElement, form.containerElement, finding.containerElement];
}
