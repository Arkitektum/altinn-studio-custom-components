// Global functions
import { hasValue } from "./helpers.js";

/**
 * Fetches text resources for a given language, falling back to a fallback language if necessary.
 *
 * @async
 * @param {string} origin - The origin URL of the API.
 * @param {string} org - The organization identifier.
 * @param {string} app - The application identifier.
 * @param {string} language - The primary language code to fetch text resources for.
 * @param {string} fallbackLanguage - The fallback language code to use if resources for the primary language are unavailable.
 * @returns {Promise<Object|null>} The text resources object if found, otherwise null.
 */
export const fetchTextResources = async (origin, org, app, language, fallbackLanguage) => {
    const textResourcesApiUrl = `${origin}/${org}/${app}/api/v1/texts/${language}`;
    const textResourcesData = await fetch(textResourcesApiUrl).then((response) => response.json());
    if (hasValue(textResourcesData)) {
        return textResourcesData;
    } else {
        console.error("Could not retrieve text resources for the selected language.");
        const fallbackTextResourcesApiUrl = `${origin}/${org}/${app}/api/v1/texts/${fallbackLanguage}`;
        const fallbackTextResourcesData = await fetch(fallbackTextResourcesApiUrl).then((response) => response.json());
        if (hasValue(fallbackTextResourcesData)) {
            return fallbackTextResourcesData;
        } else {
            console.error("Could not retrieve text resources for the fallback language.");
            return null;
        }
    }
};


/**
 * Fetches the default text resources for a given app and language.
 * If the resources for the specified language cannot be fetched, attempts to fetch resources for a fallback language.
 *
 * @async
 * @param {string} origin - The base URL or origin of the API.
 * @param {string} org - The organization identifier.
 * @param {string} app - The application identifier.
 * @param {string} language - The language code to fetch resources for (e.g., 'en', 'nb').
 * @param {string} fallbackLanguage - The fallback language code to use if the primary language fetch fails.
 * @returns {Promise<Object|null>} The fetched text resources as a JSON object, or null if both fetches fail.
 */
export const fetchDefaultTextResources = async (origin, org, app, language, fallbackLanguage) => {
    const defaultTextResourcesApiUrl = `${origin}/${org}/${app}/altinn-studio-custom-components/resource.${language}.json`;
    try {
        const response = await fetch(defaultTextResourcesApiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching default text resources:", error);
        const fallbackDefaultTextResourcesApiUrl = `${origin}/${org}/${app}/altinn-studio-custom-components/resource.${fallbackLanguage}.json`;
        const fallbackResponse = await fetch(fallbackDefaultTextResourcesApiUrl);
        if (fallbackResponse.ok) {
            return await fallbackResponse.json();
        } else {
            console.error("Could not retrieve default text resources for the fallback language.");
            return null;
        }
    }
};
