// Global functions
import { fetchDefaultTextResources, fetchTextResources } from "./textResourceHelpers.js";

/**
 * Loads a script asynchronously by creating a script element and appending it to the document body.
 *
 * @param {string} src - The source URL of the script to load.
 * @returns {Promise<HTMLScriptElement>} A promise that resolves with the script element when the script is loaded, or rejects with an error if the script fails to load.
 */
function loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            console.log(`${src} loaded`);
            resolve(script);
        };
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
}

/**
 * Initializes custom components by fetching user profile data, determining language preferences, loading text resources, and dispatching a DOMContentLoaded event.
 * This function is intended to be called once when the application starts to set up the necessary environment for custom components to function correctly.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 * @throws {Error} Throws an error if the origin, organization, or application cannot be determined from the URL, or if user profile data cannot be fetched.
 */
export default async function initCustomComponents() {
    const appId = globalThis.location.pathname.split("/");
    const origin = globalThis.location.origin;
    const org = appId?.[1];
    const app = appId?.[2];
    if (![origin?.length, org?.length, app?.length].every(Boolean)) {
        console.error("Could not determine the origin, organization, or application from the URL.");
        return;
    }

    const userProfileApiUrl = `${origin}/${org}/${app}/api/v1/profile/user`;
    const userProfileResponse = await fetch(userProfileApiUrl);
    if (!userProfileResponse.ok) {
        console.error(
            `Failed to fetch user profile data from ${userProfileApiUrl}. ` +
            `HTTP status: ${userProfileResponse.status} (${userProfileResponse.statusText})`
        );
        return;
    }
    const userProfileData = await userProfileResponse.json();
    if (!userProfileData?.profileSettingPreference?.language) {
        console.error("Could not determine the user's language preference.");
        return;
    }

    const selectedLanguage = userProfileData?.profileSettingPreference?.language;
    const fallbackLanguage = "nb";

    const [textResources, defaultTextResources] = await Promise.all([
        fetchTextResources(origin, org, app, selectedLanguage, fallbackLanguage),
        fetchDefaultTextResources(origin, org, app, selectedLanguage, fallbackLanguage)
    ]);

    globalThis.selectedLanguage = selectedLanguage;
    globalThis.textResources = textResources;
    globalThis.defaultTextResources = defaultTextResources;
    await loadScriptAsync("https://altinncdn.no/toolkits/altinn-app-frontend/4.25.3/altinn-app-frontend.js");

    const domContentLoadedEvent = new Event("DOMContentLoaded", {
        bubbles: true, // Event bubbles up through the DOM
        cancelable: false // The native event is not cancelable
    });

    document.dispatchEvent(domContentLoadedEvent);
}
