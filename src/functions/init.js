// Global functions
import { hasValue } from "./helpers.js";

/**
 * Initializes custom components by setting up event listeners and fetching necessary data.
 *
 * This function is triggered on the `window`'s `load` event. It performs the following:
 * - Extracts the organization (`org`) and application (`app`) identifiers from the URL.
 * - Fetches the user's profile data to determine their language preference.
 * - Fetches text resources for the user's selected language or falls back to a default language if necessary.
 * - Stores the selected language and text resources in the `window` object for global access.
 *
 * @async
 * @function initCustomComponents
 * @throws {Error} Logs errors to the console if:
 * - The origin, organization, or application cannot be determined from the URL.
 * - The user's language preference cannot be determined.
 * - Text resources for both the selected and fallback languages cannot be retrieved.
 */
export default function initCustomComponents() {
    window.addEventListener("load", async () => {
        const appId = window.location.pathname.split("/");
        const origin = window.location.origin;
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
        window.selectedLanguage = selectedLanguage;
        const textResourcesApiUrl = `${origin}/${org}/${app}/api/v1/texts/${selectedLanguage}`;
        const textResourcesData = await fetch(textResourcesApiUrl).then((response) => response.json());
        if (!hasValue(textResourcesData)) {
            console.error("Could not retrieve text resources for the selected language.");
            const fallbackTextResourcesApiUrl = `${origin}/${org}/${app}/api/v1/texts/${fallbackLanguage}`;
            const fallbackTextResourcesData = await fetch(fallbackTextResourcesApiUrl).then((response) => response.json());
            window.textResources = fallbackTextResourcesData;
            if (!hasValue(fallbackTextResourcesData)) {
                console.error("Could not retrieve text resources for the fallback language.");
                return;
            }
        } else {
            window.textResources = textResourcesData;
        }
    });
}
