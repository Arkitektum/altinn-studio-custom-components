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
 *
 * @async
 * @function
 * @returns {void}
 */
export default function initCustomComponents() {
    globalThis.addEventListener("load", async () => {
        const appId = globalThis.location.pathname.split("/");
        const origin = globalThis.location.origin;
        const org = appId?.[1];
        const app = appId?.[2];
        if (![origin?.length, org?.length, app?.length].every(Boolean)) {
            console.error("Could not determine the origin, organization, or application from the URL.");
            return;
        }

        const userProfileApiUrl = `${origin}/${org}/${app}/api/v1/profile/user`;
        const userProfileData = await fetch(userProfileApiUrl).then((response) => response.json());
        if (!userProfileData?.profileSettingPreference?.language) {
            console.error("Could not determine the user's language preference.");
            return;
        }

        const selectedLanguage = userProfileData?.profileSettingPreference?.language;
        const fallbackLanguage = "nb";
        globalThis.selectedLanguage = selectedLanguage;
        globalThis.textResources = await fetchTextResources(origin, org, app, selectedLanguage, fallbackLanguage);
        globalThis.defaultTextResources = await fetchDefaultTextResources(origin, org, app, selectedLanguage, fallbackLanguage);
    });
}
