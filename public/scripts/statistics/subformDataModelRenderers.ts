import type { SubformDataModelDrift, SubformDataModelVariant, XsdField } from "./subformDataModelHelpers.ts";
import { createLabelledSelect, createSummary, createTextElement } from "./dataModelBindingRenderers.ts";
import { selectStoredOption } from "./displayLayoutHelpers.ts";

/** One subform's drift as the page shows it, with whether it has anything to show under the chosen filters. */
export interface FilteredSubformDataModelDrift extends SubformDataModelDrift {
    hasFindings: boolean;
}

/**
 * @param {Object} app
 * @returns {string} The app as `owner/name`, which is also the value the application filter stores.
 */
function appKey(app: { appOwner: string; appName: string }): string {
    return `${app.appOwner}/${app.appName}`;
}

/**
 * @param {number} index - The variant's place in the list, most apps first.
 * @returns {string} Its label: A, B, C, and numbered after Z.
 */
export function variantLabel(index: number): string {
    return index < 26 ? String.fromCharCode(65 + index) : `V${index + 1}`;
}

/**
 * Describes how a variant declares a field, in the order a reader compares them: what it is, then how often it occurs.
 *
 * @param {XsdField} field
 * @returns {string} For example `decimal 0..1`, `group 1..n` or `attribute string 1..1 fixed "47365"`.
 */
export function describeField(field: XsdField): string {
    const maxOccurs = field.maxOccurs === "unbounded" ? "n" : field.maxOccurs;
    return [
        field.node === "attribute" ? "attribute" : null,
        field.type ?? "group",
        `${field.minOccurs}..${maxOccurs}`,
        field.fixed === undefined ? null : `fixed "${field.fixed}"`
    ]
        .filter((part) => part !== null)
        .join(" ");
}

/**
 * Narrows the drift to the filters chosen on the page, which are stored on globalThis.
 *
 * Choosing an app keeps the subforms it declares. The path filter keeps the differing fields whose path holds the text,
 * and then only a subform with such a field has findings. Without it, a subform has findings when its copies form more
 * than one variant or one of them could not be read.
 *
 * @param {Array} drift - The drift for every subform.
 * @returns {Array} The subforms that pass the filters, each with whether it has findings.
 */
export function filterSubformDataModelDriftBySelectedFilters(drift: SubformDataModelDrift[] | undefined): FilteredSubformDataModelDrift[] {
    const selectedApp = globalThis.subformModelSelectedApp || "";
    const pathFilter = (globalThis.subformModelPathFilter || "").trim().toLowerCase();
    return (drift || [])
        .filter(
            (entry) =>
                !selectedApp ||
                entry.variants.some((variant) => variant.apps.some((app) => appKey(app) === selectedApp)) ||
                entry.unreadable.some((app) => appKey(app) === selectedApp)
        )
        .map((entry) => {
            if (!pathFilter) return { ...entry, hasFindings: entry.variants.length > 1 || entry.unreadable.length > 0 };
            const differences = entry.differences.filter((difference) => difference.path.toLowerCase().includes(pathFilter));
            return { ...entry, differences, hasFindings: differences.length > 0 };
        });
}

/**
 * @param {Array} variants
 * @param {string} selectedApp - `owner/name`, or empty.
 * @returns {number} The index of the variant holding the selected app's copy, or -1.
 */
function selectedVariantIndex(variants: SubformDataModelVariant[], selectedApp: string): number {
    return selectedApp ? variants.findIndex((variant) => variant.apps.some((app) => appKey(app) === selectedApp)) : -1;
}

/**
 * Lists the variants with their apps, one line each, under the letter the table's columns use.
 *
 * @param {Array} variants
 * @param {number} selectedIndex - The variant to mark, or -1.
 * @returns {HTMLDListElement}
 */
function renderVariantList(variants: SubformDataModelVariant[], selectedIndex: number): HTMLDListElement {
    const listElement = document.createElement("dl");
    listElement.classList.add("subform-model-variants");
    // The root element is only worth a mention when it is one of the things the variants differ in.
    const rootsDiffer = new Set(variants.map((variant) => variant.rootElement)).size > 1;
    variants.forEach((variant, index) => {
        const fieldCount = `${variant.fieldCount} field${variant.fieldCount === 1 ? "" : "s"}`;
        const details = rootsDiffer ? `${fieldCount}, root element ${variant.rootElement}` : fieldCount;
        const termElement = createTextElement("dt", variantLabel(index));
        const descriptionElement = createTextElement("dd", `${variant.apps.map(appKey).join(", ")} (${details})`);
        if (index === selectedIndex) {
            termElement.classList.add("selected-variant");
            descriptionElement.classList.add("selected-variant");
        }
        listElement.append(termElement, descriptionElement);
    });
    return listElement;
}

/**
 * Renders the fields the variants disagree on: one row per field, one column per variant.
 *
 * @param {Object} entry - The subform's drift.
 * @param {number} selectedIndex - The variant column to mark, or -1.
 * @returns {HTMLTableElement}
 */
function renderDifferenceTable(entry: SubformDataModelDrift, selectedIndex: number): HTMLTableElement {
    const tableElement = document.createElement("table");
    tableElement.classList.add("table-dark", "subform-model-differences");
    const headRow = document.createElement("tr");
    headRow.appendChild(createTextElement("th", "Field"));
    entry.variants.forEach((variant, index) => {
        const headerElement = createTextElement("th", variantLabel(index));
        headerElement.title = variant.apps.map(appKey).join(", ");
        if (index === selectedIndex) headerElement.classList.add("selected-variant");
        headRow.appendChild(headerElement);
    });
    const headElement = document.createElement("thead");
    headElement.appendChild(headRow);

    const bodyElement = document.createElement("tbody");
    for (const difference of entry.differences) {
        const rowElement = document.createElement("tr");
        const pathElement = document.createElement("td");
        pathElement.appendChild(createTextElement("span", difference.path, "subform-model-path"));
        if (difference.hiddenBelow) {
            const below = `+ ${difference.hiddenBelow} field${difference.hiddenBelow === 1 ? "" : "s"} below`;
            pathElement.appendChild(createTextElement("span", below, "subform-model-hidden-below"));
        }
        rowElement.appendChild(pathElement);
        difference.fields.forEach((field, index) => {
            const cellElement = field ? createTextElement("td", describeField(field)) : createTextElement("td", "missing", "subform-model-missing");
            if (index === selectedIndex) cellElement.classList.add("selected-variant");
            rowElement.appendChild(cellElement);
        });
        bodyElement.appendChild(rowElement);
    }
    tableElement.append(headElement, bodyElement);
    return tableElement;
}

/**
 * Renders one subform: how many variants its copies form, and what they disagree on.
 *
 * @param {Object} entry - The subform's drift, after filtering.
 * @param {string} [selectedApp] - The app chosen in the filter, whose variant is marked. Defaults to the choice stored on globalThis.
 * @returns {HTMLDetailsElement} The list item.
 */
export function renderSubformDataModelListItem(entry: FilteredSubformDataModelDrift, selectedApp = globalThis.subformModelSelectedApp || "") {
    const listItemElement = document.createElement("details");
    listItemElement.classList.add("component-usage-list-item");

    const titleElement = createTextElement("div", entry.dataType, "component-tag-name");
    if (entry.variants.length > 1) {
        const indicatorElement = createTextElement("span", "Differs", "indicator");
        indicatorElement.classList.add("indicator-missing");
        titleElement.appendChild(indicatorElement);
    }
    if (entry.unreadable.length) {
        const indicatorElement = createTextElement("span", `Unreadable: ${entry.unreadable.length}`, "indicator");
        indicatorElement.classList.add("indicator-deprecated");
        titleElement.appendChild(indicatorElement);
    }
    const titleContainerElement = document.createElement("div");
    titleContainerElement.classList.add("component-tag-name-container");
    titleContainerElement.appendChild(titleElement);
    const appCount = entry.variants.reduce((total, variant) => total + variant.apps.length, 0) + entry.unreadable.length;
    const countsElement = document.createElement("div");
    countsElement.classList.add("usage-container");
    countsElement.append(
        createTextElement("span", `Variants: ${entry.variants.length}`, "component-usage"),
        createTextElement("span", `Apps: ${appCount}`, "app-usage")
    );
    listItemElement.appendChild(createSummary(titleContainerElement, [countsElement]));

    const detailsElement = document.createElement("div");
    detailsElement.classList.add("usage-details");
    const selectedIndex = selectedVariantIndex(entry.variants, selectedApp);
    if (entry.variants.length) detailsElement.appendChild(renderVariantList(entry.variants, selectedIndex));
    if (entry.differences.length) {
        detailsElement.appendChild(renderDifferenceTable(entry, selectedIndex));
    } else if (globalThis.subformModelPathFilter?.trim() && entry.variants.length > 1) {
        detailsElement.appendChild(createTextElement("span", "No field that differs matches the path filter.", "message"));
    } else if (entry.variants.length > 1) {
        detailsElement.appendChild(createTextElement("span", "The variants declare the same fields under different root elements.", "message"));
    } else if (entry.variants.length === 1) {
        detailsElement.appendChild(createTextElement("span", "Every copy that could be read declares the same fields.", "message"));
    }
    if (entry.unreadable.length) {
        const unreadableElement = document.createElement("dl");
        unreadableElement.classList.add("subform-model-unreadable");
        for (const app of entry.unreadable) {
            unreadableElement.append(createTextElement("dt", appKey(app)), createTextElement("dd", app.error));
        }
        detailsElement.append(createTextElement("p", "Could not be read", "subform-model-unreadable-title"), unreadableElement);
    }
    listItemElement.appendChild(detailsElement);
    return listItemElement;
}

/**
 * Renders the subforms with findings, under a line saying how many of all the subforms that is, and the ones whose copies agree after them when asked for.
 *
 * @param {Array} drift - The subforms that passed the filters.
 * @param {boolean} [showAgreeing] - List the subforms without findings too. Defaults to the choice stored on globalThis.
 * @returns {HTMLDivElement} The list.
 */
export function renderSubformDataModelList(drift: FilteredSubformDataModelDrift[], showAgreeing = globalThis.subformModelShowAgreeing === true) {
    const listElement = document.createElement("div");
    listElement.id = "subform-model-list";
    listElement.classList.add("paper");
    const withFindings = drift.filter((entry) => entry.hasFindings);
    const withoutFindings = drift.filter((entry) => !entry.hasFindings);
    listElement.appendChild(
        createTextElement(
            "p",
            `${withFindings.length} of ${drift.length} subforms have copies that differ for the chosen filters.`,
            "binding-drift-summary"
        )
    );
    [...withFindings, ...(showAgreeing ? withoutFindings : [])].forEach((entry) => listElement.appendChild(renderSubformDataModelListItem(entry)));
    return listElement;
}

/**
 * Draws the list again, filtered by the choices now stored on globalThis.
 *
 * @param {HTMLElement} containerElement - The page, holding the list.
 * @param {Array} drift - The drift for every subform.
 */
function handleFilterChange(containerElement: HTMLElement, drift: SubformDataModelDrift[] | undefined) {
    containerElement.querySelector("#subform-model-list")?.remove();
    containerElement.appendChild(renderSubformDataModelList(filterSubformDataModelDriftBySelectedFilters(drift)));
}

/**
 * Renders the filters for the page: application, field path, and whether to list the subforms whose copies agree. Each starts on the choice stored on globalThis when it is still offered.
 *
 * @param {HTMLElement} containerElement - The page, whose list is drawn again on every change.
 * @param {Array} drift - The drift for every subform.
 * @returns {Array<HTMLElement>} The filter elements, in the order they are shown.
 */
export function renderSubformDataModelFilters(containerElement: HTMLElement, drift: SubformDataModelDrift[] | undefined): HTMLElement[] {
    // Only the apps that declare a subform are offered, in the order the API answered them.
    const appKeys = [
        ...new Set(
            (drift || []).flatMap((entry) => [...entry.variants.flatMap((variant) => variant.apps.map(appKey)), ...entry.unreadable.map(appKey)])
        )
    ];
    const application = createLabelledSelect("Application", "subform-model-application-filter-select", [
        { value: "", text: "All applications" },
        ...appKeys.map((key) => ({ value: key, text: key }))
    ]);
    globalThis.subformModelSelectedApp = selectStoredOption(application.selectElement, globalThis.subformModelSelectedApp, "");

    const pathContainer = document.createElement("div");
    pathContainer.classList.add("filter-container");
    const pathLabel = createTextElement("label", "Field path") as HTMLLabelElement;
    pathLabel.htmlFor = "subform-model-path-filter-input";
    const pathInput = document.createElement("input");
    pathInput.type = "text";
    pathInput.id = "subform-model-path-filter-input";
    pathInput.placeholder = "Enter text to filter fields";
    pathInput.value = globalThis.subformModelPathFilter || "";
    pathContainer.append(pathLabel, pathInput);

    const agreeingContainer = document.createElement("div");
    agreeingContainer.classList.add("filter-container");
    const agreeingLabel = document.createElement("label");
    agreeingLabel.classList.add("checkbox-filter");
    const agreeingCheckbox = document.createElement("input");
    agreeingCheckbox.type = "checkbox";
    agreeingCheckbox.id = "subform-model-show-agreeing";
    agreeingCheckbox.checked = globalThis.subformModelShowAgreeing === true;
    agreeingLabel.append(agreeingCheckbox, document.createTextNode("Show subforms whose copies agree"));
    agreeingContainer.appendChild(agreeingLabel);

    application.selectElement.onchange = () => {
        globalThis.subformModelSelectedApp = application.selectElement.value;
        handleFilterChange(containerElement, drift);
    };
    pathInput.oninput = () => {
        globalThis.subformModelPathFilter = pathInput.value;
        handleFilterChange(containerElement, drift);
    };
    agreeingCheckbox.onchange = () => {
        globalThis.subformModelShowAgreeing = agreeingCheckbox.checked;
        handleFilterChange(containerElement, drift);
    };
    return [application.containerElement, pathContainer, agreeingContainer];
}
