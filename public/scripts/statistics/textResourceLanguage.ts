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

/** The language the package's texts and an app's own texts fall back to, as in the app. */
const TEXT_FALLBACK_LANGUAGE = "nb";

/**
 * Puts the text resources for one language on globalThis, which is where the components read them: the default
 * ones, every app's, and the selected app's own. Where the package or an app has no texts in the language, its nb texts are used, as in the app.
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
    // The package's texts fall back to nb for a language it has none in, as an app does when the package ships no resource file for its language.
    const textsInLanguage = getResourcesForLanguage(multilingualDefaultTextResources, language);
    const defaultTextResources = textsInLanguage?.resources?.length
        ? textsInLanguage
        : getResourcesForLanguage(multilingualDefaultTextResources, TEXT_FALLBACK_LANGUAGE);
    // An app's own texts fall back to its nb texts when it has none in the language, as the app does when it has no resource file for it. Like the app, a whole file falls back, not single texts missing from one.
    const appTextsInLanguage = getAppResourceValuesForLanguage(multilingualAppResourceValues, language);
    const appTextsInFallback = getAppResourceValuesForLanguage(multilingualAppResourceValues, TEXT_FALLBACK_LANGUAGE);
    const appResourceValues = appTextsInLanguage.map((app: ApiValue, index: number) =>
        app?.resources?.resources?.length ? app : (appTextsInFallback[index] ?? app)
    );
    const textResources = getLocalTextResourcesForApp(appName, appOwner, appResourceValues);
    addDataToGlobalThis({
        defaultTextResources,
        appResourceValues,
        textResources
    });
}
