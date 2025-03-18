/**
 * Initializes custom components by fetching user profile and text resources based on the user's language preference.
 *
 * This function adds an event listener to the window's "load" event, which performs the following steps:
 * 1. Extracts the organization and application identifiers from the URL.
 * 2. Constructs the API URL to fetch the user's profile data.
 * 3. Fetches the user's profile data and determines the user's language preference.
 * 4. Constructs the API URL to fetch text resources for the selected language.
 * 5. Fetches the text resources and stores them in the global `window` object.
 *
 * @returns {void}
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
        window.selectedLanguage = selectedLanguage;
        const textResourcesApiUrl = `${origin}/${org}/${app}/api/v1/texts/${selectedLanguage}`;
        const textResourcesData = await fetch(textResourcesApiUrl).then((response) => response.json());
        if (!textResourcesData?.length) {
            console.error("Could not retrieve text resources for the selected language.");
            return;
        }

        window.textResources = textResourcesData;
    });
}
