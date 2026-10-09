import type { ApiValue } from "../types.ts";
// Local functions
import { getAppResourceValuesForLanguage, getResourcesForLanguage } from "../getters.ts";
import { addDataToGlobalThis } from "../localStorage.ts";

/**
 * Retrieves the local text resources for a specific application based on its name and owner.
 *
 * @param {string} appName - The name of the application.
 * @param {string} appOwner - The owner of the application.
 * @param {Array<{ appName: string, appOwner: string, resources: Array }>} appResourceValues -
 *   An array of objects containing application names, owners, and their associated resource values.
 * @returns {Array} The resource values for the specified application, or an empty array if not found.
 */
export function getLocalTextResourcesForApp(appName: string | undefined, appOwner: string | undefined, appResourceValues: ApiValue) {
    return appResourceValues.find((app: ApiValue) => app.appName === appName && app.appOwner === appOwner)?.resources || [];
}

/**
 * Puts the text resources for one language on globalThis, which is where the components read them: the default
 * ones, every app's, and the selected app's own.
 *
 * @param {Array} multilingualDefaultTextResources - The default text resources in every language.
 * @param {Array} multilingualAppResourceValues - Every app's text resources in every language.
 * @param {string} language - The language code, e.g. "nb".
 * @param {string} [appOwner] - The owner of the selected app.
 * @param {string} [appName] - The name of the selected app.
 */
export function applyTextResourcesForLanguage(
    multilingualDefaultTextResources: ApiValue,
    multilingualAppResourceValues: ApiValue,
    language: string,
    appOwner: string | undefined,
    appName: string | undefined
) {
    const defaultTextResources = getResourcesForLanguage(multilingualDefaultTextResources, language);
    const appResourceValues = getAppResourceValuesForLanguage(multilingualAppResourceValues, language);
    const textResources = getLocalTextResourcesForApp(appName, appOwner, appResourceValues);
    addDataToGlobalThis({
        defaultTextResources,
        appResourceValues,
        textResources
    });
}
