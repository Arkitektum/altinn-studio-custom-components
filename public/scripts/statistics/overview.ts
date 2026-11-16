import type { ApiValue } from "../types.ts";
import type { StatisticsPageId } from "./pageLinks.ts";
import type { SubformDataModelDrift } from "./subformDataModelHelpers.ts";

import { STATISTICS_PATH } from "./pageLinks.ts";
import { getPackageVersionClasses } from "./versionStatus.ts";

/** One line of the overview: a page, and what it holds or does. */
export interface OverviewLine {
    pageId: StatisticsPageId;
    label: string;
    summary: string;
}

/** The data the overview counts, as the pages read it from globalThis. */
export interface OverviewData {
    allTextResourceUsage?: ApiValue[];
    componentUsage?: { tagName: string; usages: { appOwner?: string; appName?: string }[] }[];
    dataModelBindingDrift?: { usages: unknown[] }[];
    subformDataModelDrift?: SubformDataModelDrift[];
    packageVersions?: { packageVersions?: ApiValue }[];
    latestPackageVersions?: ApiValue;
}

function plural(count: number, one: string, many: string) {
    return `${count} ${count === 1 ? one : many}`;
}

/**
 * The overview's lines, one per page in the order of the sidebar. A page that checks the synchronized data says what it found, counted as the page counts it with no filters chosen. A page that draws or checks forms on request says what it does.
 *
 * @param {OverviewData} data - The data the pages read.
 * @returns {OverviewLine[]} The lines.
 */
export function getOverviewLines(data: OverviewData): OverviewLine[] {
    const textResources = data.allTextResourceUsage ?? [];
    const defaultResourceCount = textResources.filter((entry) => !entry.presence).length;
    const missingResourceCount = textResources.filter((entry) => entry.presence === "missing").length;
    const localValueResourceCount = textResources.filter((entry) => entry.presence === "localValue").length;

    const components = data.componentUsage ?? [];
    const usedComponents = components.filter((component) => component.usages.length > 0);
    const appsUsingComponents = new Set(components.flatMap((component) => component.usages.map((usage) => `${usage.appOwner}/${usage.appName}`)));

    const bindingDrift = data.dataModelBindingDrift ?? [];
    const componentsWithFindings = bindingDrift.filter((component) => component.usages.length > 0).length;

    // As the subform data models page counts with no filters chosen: more than one variant, or a copy that could not be read.
    const subformDrift = data.subformDataModelDrift ?? [];
    const differingSubforms = subformDrift.filter((entry) => entry.variants.length > 1 || entry.unreadable.length > 0).length;

    const apps = data.packageVersions ?? [];
    const appsBehind = apps.filter((app) =>
        Object.values(getPackageVersionClasses(app.packageVersions, data.latestPackageVersions)).some((className) => className !== null)
    ).length;

    return [
        {
            pageId: "resource-usage",
            label: "Resource usage",
            summary: `${plural(defaultResourceCount, "text resource", "text resources")}, ${missingResourceCount} missing, ${localValueResourceCount} missing with local value`
        },
        {
            pageId: "component-usage",
            label: "Component usage",
            summary: `${usedComponents.length} of ${plural(components.length, "component", "components")} in use, in ${plural(appsUsingComponents.size, "app", "apps")}`
        },
        {
            pageId: "data-model-bindings",
            label: "Data model bindings",
            summary: `${componentsWithFindings} of ${plural(bindingDrift.length, "checked component", "checked components")} with findings`
        },
        {
            pageId: "subform-data-models",
            label: "Subform data models",
            summary: `${differingSubforms} of ${plural(subformDrift.length, "subform", "subforms")} with copies that differ`
        },
        {
            pageId: "package-versions",
            label: "Package versions",
            summary: `${plural(apps.length, "app", "apps")}, ${appsBehind} behind on a package`
        },
        { pageId: "display-layouts", label: "Display layouts", summary: "Draws an app's form with its example data" },
        { pageId: "render-health", label: "Render health", summary: "Checks every form for components that could not be drawn" },
        { pageId: "unshown-data", label: "Unshown data", summary: "Finds values in the example data that no component shows" },
        { pageId: "upgrade-check", label: "Upgrade check", summary: "Finds forms that would draw differently after an upgrade" }
    ];
}

/**
 * Draws the overview: each page as a link, with what it holds or does beside it.
 *
 * @param {HTMLElement} containerElement - The element the page is drawn in.
 * @param {OverviewData} [data] - The data the pages read. Defaults to what is on globalThis.
 */
export function renderOverviewPage(containerElement: HTMLElement, data: OverviewData = globalThis) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Overview";
    containerElement.appendChild(titleElement);

    const listElement = document.createElement("dl");
    listElement.classList.add("paper", "overview-list");
    for (const line of getOverviewLines(data)) {
        const termElement = document.createElement("dt");
        const linkElement = document.createElement("a");
        linkElement.href = `${STATISTICS_PATH}/${line.pageId}`;
        linkElement.textContent = line.label;
        termElement.appendChild(linkElement);
        const descriptionElement = document.createElement("dd");
        descriptionElement.textContent = line.summary;
        listElement.append(termElement, descriptionElement);
    }
    containerElement.appendChild(listElement);
}
