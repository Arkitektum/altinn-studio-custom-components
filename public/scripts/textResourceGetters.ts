import type { ApiValue } from "./types.ts";

/*
 * Reading text resources for a language. Kept apart from getters.ts, which builds the dev tools editors, so the statistics page can use these without loading the editor.
 */

/**
 * Retrieves the default value for a given resource ID from the global defaultTextResources.
 *
 * @param {string} resourceId - The ID of the resource to look up.
 * @returns {(string|null)} The default value of the resource if found, otherwise null.
 */
export function getDefaultValueForResource(resourceId: string) {
    const defaults = globalThis.defaultTextResources as ApiValue;
    const defaultResources = defaults && Array.isArray(defaults.resources) ? defaults.resources : [];
    const defaultResource = defaultResources.find((res: ApiValue) => res.id === resourceId);
    return defaultResource ? defaultResource.value : null;
}

/**
 * Retrieves resources for a specific language from a list of resource objects.
 *
 * @param {Array<{id: string, values: Object.<string, string>}>} resources - The array of resource objects, each containing an id and a values object mapping language codes to strings.
 * @param {string} language - The language code to filter resources by.
 * @returns {{ language: string, resources: Array<{ id: string, value: string }> }} An object containing the requested language and an array of resources for that language.
 */
export function getResourcesForLanguage(resources: ApiValue, language: string) {
    const languageMap: Record<string, ApiValue[]> = {};

    resources.forEach((resource: ApiValue) => {
        if (!resource.id || typeof resource.values !== "object") return;

        Object.entries(resource.values).forEach(([lang, value]) => {
            if (!languageMap[lang]) {
                languageMap[lang] = [];
            }

            languageMap[lang]!.push({
                id: resource.id,
                value
            });
        });
    });
    return {
        language,
        resources: languageMap[language] || []
    };
}

/**
 * Retrieves application resource values for a specific language.
 *
 * @param {Array<Object>} appResourceValues - Array of application resource objects.
 * @param {string} language - The language code to filter resources by.
 * @returns {Array<Object>} Array of objects containing appName, appOwner, and filtered resources for the specified language.
 */
export function getAppResourceValuesForLanguage(appResourceValues: ApiValue, language: string) {
    return appResourceValues.map((app: ApiValue) => {
        return {
            appName: app?.appName,
            appOwner: app?.appOwner,
            resources: getResourcesForLanguage(app?.resourceValues || [], language)
        };
    });
}
