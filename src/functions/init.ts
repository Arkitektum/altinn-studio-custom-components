// Global functions
import { fetchDefaultTextResources, fetchTextResources } from "./textResourceHelpers.ts";
import { fetchWithTimeoutAndClientLogger, getClientLoggerInstance } from "./clientLoggerHelpers.ts";
import type { ClientLogger } from "@arkitektum/client-logger";
import type { LogCustomField } from "../types.ts";
import { updateBodyClassNamesForApplication } from "./htmlElementHelpers.js";

/**
 * Loads a script asynchronously by creating a script element and appending it to the document body.
 *
 * @param src - The source URL of the script to load.
 * @param clientLogger - Optional client logger instance for logging errors.
 * @param clientLoggerCustomFields - Optional custom fields for the client logger.
 * @returns A promise that resolves with the script element when the script is loaded, or rejects with an error if the script fails to load.
 */
function loadScriptAsync(
    src: string,
    clientLogger: ClientLogger | null = null,
    clientLoggerCustomFields: LogCustomField[] = []
): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            console.log(`${src} loaded`);
            resolve(script);
        };
        script.onerror = () => {
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Script load error for ${src}`,
                    custom_fields: clientLoggerCustomFields
                }
            ]);
            reject(new Error(`Script load error for ${src}`));
        };
        document.body.appendChild(script);
    });
}

/**
 * Fetches the default text resources for a given language, with an optional fallback language if the primary fetch fails.
 *
 * @param location - Where the page is, which carries the instance id in its hash.
 * @returns The instance ID extracted from the location hash.
 */
function getInstanceIdFromLocation(location: Location): string {
    const splittedHash = location?.hash?.split("/");
    const instanceIdWithQuery = `${splittedHash?.[2]}/${splittedHash?.[3]}`;
    // Splitting a string always yields a first part, even when there was no separator to split on.
    return instanceIdWithQuery.split("?")[0]!;
}

/**
 * Fetches the user's preferred language from the Altinn profile API.
 *
 * This function never throws. Any failure (network error, timeout, non-OK response such as HTTP 500,
 * an unparsable response body, or a missing language preference) is logged and results in `null`,
 * so the caller can fall back to the default language instead of leaving the app unrendered.
 *
 * @async
 * @param origin - The origin URL of the app.
 * @param org - The organization identifier.
 * @param app - The application identifier.
 * @param clientLogger - The client logger instance.
 * @param clientLoggerCustomFields - Custom fields to include in the client logger.
 * @returns The user's language preference, or null if it could not be determined.
 */
async function fetchUserLanguage(
    origin: string,
    org: string,
    app: string,
    clientLogger: ClientLogger | null,
    clientLoggerCustomFields: LogCustomField[]
): Promise<string | null> {
    const userProfileApiUrl = `${origin}/${org}/${app}/api/v1/profile/user`;
    const logError = (message: string) => {
        clientLogger?.postLogData([
            {
                level: "Error",
                message,
                custom_fields: clientLoggerCustomFields
            }
        ]);
        console.error(message);
    };

    let userProfileResponse;
    try {
        userProfileResponse = await fetchWithTimeoutAndClientLogger(userProfileApiUrl, {}, 5000, clientLogger, clientLoggerCustomFields);
    } catch (error) {
        logError(`Failed to fetch user profile data from ${userProfileApiUrl}. Error: ${(error as Error)?.message}`);
        return null;
    }

    if (!userProfileResponse?.ok) {
        logError(
            `Failed to fetch user profile data from ${userProfileApiUrl}. ` +
                `HTTP status: ${userProfileResponse?.status} (${userProfileResponse?.statusText})`
        );
        return null;
    }

    let userProfileData;
    try {
        userProfileData = await userProfileResponse.json();
    } catch (error) {
        logError(`Could not parse user profile data from ${userProfileApiUrl}. Error: ${(error as Error)?.message}`);
        return null;
    }

    const language = userProfileData?.profileSettingPreference?.language;
    if (!language) {
        logError("Could not determine the user's language preference.");
        return null;
    }

    return language;
}

/**
 * Initializes custom components by fetching user profile data, determining language preferences, loading text resources, and dispatching a DOMContentLoaded event.
 * This function is intended to be called once when the application starts to set up the necessary environment for custom components to function correctly.
 *
 * Failures while determining the user's language or loading text resources are logged and do not abort initialization;
 * the app frontend is loaded with the fallback language ("nb") instead.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 * @throws {Error} Throws an error if the app frontend script could not be loaded.
 */
export default async function initCustomComponents() {
    const appId = globalThis.location.pathname.split("/");
    const instanceId = getInstanceIdFromLocation(globalThis.location);
    const origin = globalThis.location.origin;
    const org = appId?.[1];
    const app = appId?.[2];
    const altinnAppFrontendVersionFallback = "4.29.0";
    const altinnAppFrontendVersion =
        document.querySelector<HTMLMetaElement>("meta[data-altinn-app-frontend-version]")?.dataset?.altinnAppFrontendVersion || altinnAppFrontendVersionFallback;

    let clientLogger = null;
    try {
        clientLogger = getClientLoggerInstance();
    } catch (error) {
        console.error("Could not create the client logger instance.", error);
    }
    // Both are parsed out of the URL and either can come back missing. The logger takes that in its stride, so
    // they are carried as they are rather than being filled in with something that was never true.
    const clientLoggerCustomFields = [
        { key: "instanceId", value: instanceId },
        { key: "app", value: app }
    ] as LogCustomField[];

    if (!origin || !org || !app) {
        console.error("Could not determine the origin, organization, or application from the URL.");
        return;
    }

    const fallbackLanguage = "nb";
    let selectedLanguage = fallbackLanguage;
    let textResources = null;
    let defaultTextResources = null;

    try {
        updateBodyClassNamesForApplication(org, app);

        selectedLanguage = (await fetchUserLanguage(origin, org, app, clientLogger, clientLoggerCustomFields)) || fallbackLanguage;

        [textResources, defaultTextResources] = await Promise.all([
            fetchTextResources(origin, org, app, selectedLanguage, fallbackLanguage, clientLogger, clientLoggerCustomFields),
            fetchDefaultTextResources(origin, org, app, selectedLanguage, fallbackLanguage, clientLogger, clientLoggerCustomFields)
        ]);
    } catch (error) {
        // Language and text resource problems must never prevent the app frontend from being loaded,
        // as that would leave the user with a blank page. Log and continue with what we have.
        clientLogger?.postLogData([
            {
                level: "Error",
                message: `Failed to prepare text resources for language '${selectedLanguage}'. Error: ${(error as Error)?.message}`,
                custom_fields: clientLoggerCustomFields
            }
        ]);
        console.error(`Failed to prepare text resources for language '${selectedLanguage}'.`, error);
    }

    globalThis.selectedLanguage = selectedLanguage;
    globalThis.textResources = textResources;
    globalThis.defaultTextResources = defaultTextResources;

    await loadScriptAsync(
        `https://altinncdn.no/toolkits/altinn-app-frontend/${altinnAppFrontendVersion}/altinn-app-frontend.js`,
        clientLogger,
        clientLoggerCustomFields
    );

    const domContentLoadedEvent = new Event("DOMContentLoaded", {
        bubbles: true, // Event bubbles up through the DOM
        cancelable: false // The native event is not cancelable
    });

    document.dispatchEvent(domContentLoadedEvent);
}
