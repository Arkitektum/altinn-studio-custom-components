/**
 * Links to the statistics pages: the open page and its filter choices are kept in the address, as `#/<page>?<filter>=<value>`, so a page can be reloaded, sent to someone, or reached with Back and Forward.
 */

export type StatisticsPageId =
    "resource-usage" | "component-usage" | "data-model-bindings" | "subform-data-models" | "package-versions" | "display-layouts" | "render-health";

type FilterValue = string | boolean;

/**
 * The filters each page keeps in globalThis: for each name used in the address, the global it is kept in and its default.
 * A page opened from the sidebar starts from these defaults. A checkbox filter is written to the address as "1" when ticked.
 */
export const pageFilters: Record<StatisticsPageId, Record<string, { global: keyof typeof globalThis; defaultValue: FilterValue }>> = {
    "resource-usage": {
        usage: { global: "selectedFilter", defaultValue: "all" },
        owner: { global: "selectedAppOwner", defaultValue: "" },
        app: { global: "selectedAppName", defaultValue: "" },
        form: { global: "selectedForm", defaultValue: "" },
        text: { global: "textFilter", defaultValue: "" },
        match: { global: "matchBy", defaultValue: "id" }
    },
    "component-usage": {
        usage: { global: "componentUsageFilter", defaultValue: "all" },
        owner: { global: "componentSelectedAppOwner", defaultValue: "" },
        app: { global: "componentSelectedAppName", defaultValue: "" },
        form: { global: "componentSelectedForm", defaultValue: "" },
        type: { global: "componentTypeFilter", defaultValue: "" },
        text: { global: "componentTextFilter", defaultValue: "" },
        match: { global: "componentMatchBy", defaultValue: "tag" }
    },
    "data-model-bindings": {
        owner: { global: "bindingDriftSelectedAppOwner", defaultValue: "" },
        app: { global: "bindingDriftSelectedAppName", defaultValue: "" },
        form: { global: "bindingDriftSelectedForm", defaultValue: "" },
        finding: { global: "bindingDriftFindingFilter", defaultValue: "" },
        all: { global: "bindingDriftShowWithoutFindings", defaultValue: false }
    },
    "subform-data-models": {
        app: { global: "subformModelSelectedApp", defaultValue: "" },
        path: { global: "subformModelPathFilter", defaultValue: "" },
        agreeing: { global: "subformModelShowAgreeing", defaultValue: false }
    },
    "package-versions": {},
    "display-layouts": {},
    "render-health": {}
};

/**
 * The choices on the display layouts page, which it passes from one drawing to the next rather than keeping in globalThis.
 */
export interface DisplayLayoutsOptions {
    displayLayoutAppOwner?: string | null;
    displayLayoutAppName?: string | null;
    formType?: string;
    language?: string;
    fileNames?: Record<string, string>;
}

const globals = globalThis as unknown as Record<string, FilterValue | undefined>;

export function isStatisticsPageId(value: string | undefined): value is StatisticsPageId {
    return value !== undefined && Object.hasOwn(pageFilters, value);
}

/**
 * Sets every filter of a page to its default.
 *
 * @param {StatisticsPageId} pageId - The page.
 */
export function resetPageFilters(pageId: StatisticsPageId) {
    for (const { global, defaultValue } of Object.values(pageFilters[pageId])) {
        globals[global] = defaultValue;
    }
}

/**
 * Sets a page's filters from the address: the ones it names to their value there, the others to their default.
 *
 * @param {StatisticsPageId} pageId - The page.
 * @param {URLSearchParams} params - The filters in the address.
 */
export function applyPageFilters(pageId: StatisticsPageId, params: URLSearchParams) {
    for (const [name, { global, defaultValue }] of Object.entries(pageFilters[pageId])) {
        const value = params.get(name);
        if (value === null) {
            globals[global] = defaultValue;
        } else {
            globals[global] = typeof defaultValue === "boolean" ? value === "1" : value;
        }
    }
}

/**
 * The address of a page with its filters as they are now, leaving out the ones at their default.
 *
 * @param {StatisticsPageId} pageId - The page.
 * @returns {string} The address, e.g. "#/component-usage?app=et-v4".
 */
export function getPageHash(pageId: StatisticsPageId) {
    const params = new URLSearchParams();
    for (const [name, { global, defaultValue }] of Object.entries(pageFilters[pageId])) {
        const value = globals[global] ?? defaultValue;
        if (value === defaultValue) continue;
        params.set(name, typeof defaultValue === "boolean" ? (value ? "1" : "0") : String(value));
    }
    const query = params.toString();
    return `#/${pageId}${query ? `?${query}` : ""}`;
}

/**
 * The address of the display layouts page with its choices, leaving out the ones at their default.
 *
 * @param {DisplayLayoutsOptions} options - The choices on the page.
 * @returns {string} The address, e.g. "#/display-layouts?owner=dibk&app=et-v4&lang=nn".
 */
export function getDisplayLayoutsHash(options: DisplayLayoutsOptions) {
    const params = new URLSearchParams();
    if (options.displayLayoutAppOwner) params.set("owner", options.displayLayoutAppOwner);
    if (options.displayLayoutAppName) params.set("app", options.displayLayoutAppName);
    if (options.formType && options.formType !== "main") params.set("form", options.formType);
    if (options.language && options.language !== "nb") params.set("lang", options.language);
    for (const [dataType, fileName] of Object.entries(options.fileNames || {})) {
        if (fileName) params.set(`file.${dataType}`, fileName);
    }
    const query = params.toString();
    return `#/display-layouts${query ? `?${query}` : ""}`;
}

/**
 * Reads the display layouts page's choices from the address.
 *
 * @param {URLSearchParams} params - The choices in the address.
 * @returns {DisplayLayoutsOptions} The choices, with the ones the address leaves out at their default.
 */
export function getDisplayLayoutsOptions(params: URLSearchParams): DisplayLayoutsOptions {
    const fileNames: Record<string, string> = {};
    for (const [name, value] of params) {
        if (name.startsWith("file.") && name.length > "file.".length) fileNames[name.slice("file.".length)] = value;
    }
    return {
        displayLayoutAppOwner: params.get("owner"),
        displayLayoutAppName: params.get("app"),
        formType: params.get("form") || "main",
        language: params.get("lang") || "nb",
        fileNames
    };
}

/**
 * Reads which page, and which choices on it, an address names.
 *
 * @param {string} hash - The address's fragment, e.g. "#/component-usage?app=et-v4".
 * @returns {{ pageId: StatisticsPageId, params: URLSearchParams } | null} The page and the choices, or null when the address names no page.
 */
export function parsePageHash(hash: string) {
    const match = /^#\/([^?]*)(?:\?(.*))?$/.exec(hash);
    const pageId = match?.[1];
    if (!isStatisticsPageId(pageId)) return null;
    return { pageId, params: new URLSearchParams(match?.[2] ?? "") };
}

/**
 * Puts an address in the address bar. A new page gets an entry of its own in the history, so Back returns to the page before it. A filter choice replaces the entry, so Back does not step through every keystroke.
 *
 * @param {string} hash - The address.
 * @param {Object} [options]
 * @param {boolean} [options.newEntry] - Add an entry to the history rather than replacing the current one.
 */
export function setLocationHash(hash: string, { newEntry = false }: { newEntry?: boolean } = {}) {
    if (globalThis.location.hash === hash) return;
    if (newEntry) {
        globalThis.history.pushState(null, "", hash);
    } else {
        globalThis.history.replaceState(null, "", hash);
    }
}
