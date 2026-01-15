// Global functions
import { fetchDefaultTextResources, fetchTextResources } from "./textResourceHelpers.js";

/**
 * Initializes custom components by fetching user profile and text resources.
 *
 * This function listens for the window "load" event, then:
 * - Parses the current URL to determine the origin, organization, and application.
 * - Fetches the user's profile to determine their language preference.
 * - Fetches text resources and default text resources based on the user's language.
 * - Sets global variables for selected language and text resources.
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
