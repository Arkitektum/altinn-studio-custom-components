// Dependencies
import type { ClientLogger } from "@arkitektum/client-logger";
import type { LogCustomField } from "../types.ts";
import { fetchWithTimeoutAndClientLogger } from "./clientLoggerHelpers.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Fetches text resources for a given language, falling back to a fallback language if necessary.
 *
 * @async
 * @param origin - The origin URL of the API.
 * @param org - The organization identifier.
 * @param app - The application identifier.
 * @param language - The primary language code to fetch text resources for.
 * @param fallbackLanguage - The fallback language code to use if resources for the primary language are unavailable.
 * @param clientLogger - The client logger instance.
 * @param customFields - Custom fields to include in the client logger.
 * @returns The text resources object if found, otherwise null.
 */
export const fetchTextResources = async (
    origin: string,
    org: string,
    app: string,
    language: string,
    fallbackLanguage: string | null,
    clientLogger?: ClientLogger | null,
    customFields?: LogCustomField[]
): Promise<unknown> => {
    // Basic validation of required parameters to avoid constructing invalid URLs
    const isNonEmptyString = (value: unknown): value is string => hasValue(value) && typeof value === "string" && value.trim().length > 0;

    if (!isNonEmptyString(origin) || !isNonEmptyString(org) || !isNonEmptyString(app) || !isNonEmptyString(language)) {
        console.error(
            "Invalid parameters provided to fetchTextResources. " + "Expected non-empty strings for 'origin', 'org', 'app', and 'language'.",
            { origin, org, app, language }
        );
    }

    if (!isNonEmptyString(language)) {
        return null;
    }

    // Attempt the fallback language when the primary fetch fails, as long as it is valid and different.
    const canFallBack = isNonEmptyString(fallbackLanguage) && fallbackLanguage !== language;
    const tryFallback = () => (canFallBack ? fetchTextResources(origin, org, app, fallbackLanguage, null, clientLogger, customFields) : null);

    const textResourcesApiUrl = `${origin}/${org}/${app}/api/v1/texts/${language}`;
    try {
        const primaryResponse = await fetchWithTimeoutAndClientLogger(textResourcesApiUrl, {}, 5000, clientLogger, customFields);
        if (primaryResponse!.ok) {
            const textResourcesData = await primaryResponse!.json();
            if (hasValue(textResourcesData)) {
                return textResourcesData;
            }
            return tryFallback();
        } else {
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Could not retrieve text resources for language '${language}' from URL '${textResourcesApiUrl}'. Response status: ${primaryResponse!.status}.`,
                    custom_fields: customFields
                }
            ]);
            console.error(
                `Could not retrieve text resources for language '${language}' from URL '${textResourcesApiUrl}'. Response status: ${primaryResponse!.status}.`
            );
            return tryFallback();
        }
    } catch (error) {
        clientLogger?.postLogData([
            {
                level: "Error",
                message: `Network or parsing error while retrieving text resources for language '${language}' from URL '${textResourcesApiUrl}': ${(error as Error).message}`,
                custom_fields: customFields
            }
        ]);
        console.error(`Network or parsing error while retrieving text resources for language '${language}' from URL '${textResourcesApiUrl}':`, error);
        return tryFallback();
    }
};

/**
 * Fetches the default text resources for a given app and language.
 * If the resources for the specified language cannot be fetched, attempts to fetch resources for a fallback language.
 *
 * @async
 * @param origin - The base URL or origin of the API.
 * @param org - The organization identifier.
 * @param app - The application identifier.
 * @param language - The language code to fetch resources for (e.g., 'en', 'nb').
 * @param fallbackLanguage - The fallback language code to use if the primary language fetch fails.
 * @param clientLogger - The client logger instance.
 * @param customFields - Custom fields to include in the client logger.
 * @returns The fetched text resources as a JSON object, or null if both fetches fail.
 */
export const fetchDefaultTextResources = async (
    origin: string,
    org: string,
    app: string,
    language: string,
    fallbackLanguage: string | null,
    clientLogger?: ClientLogger | null,
    customFields?: LogCustomField[]
): Promise<unknown> => {
    const defaultTextResourcesApiUrl = `${origin}/${org}/${app}/altinn-studio-custom-components/resource.${language}.json`;

    try {
        const response = await fetchWithTimeoutAndClientLogger(defaultTextResourcesApiUrl, {}, 5000, clientLogger, customFields);
        if (response!.ok) {
            // Successful response: return parsed JSON for the requested language
            return await response!.json();
        } else if (hasValue(fallbackLanguage) && fallbackLanguage !== language) {
            // Failed to retrieve resources for the primary language, try the fallback language
            console.error(`Could not retrieve default text resources for language: ${language}, fetching fallback language: ${fallbackLanguage}`);
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Could not retrieve default text resources for language: ${language} from URL '${defaultTextResourcesApiUrl}'. Response status: ${response!.status}. Fetching fallback language: ${fallbackLanguage}`,
                    custom_fields: customFields
                }
            ]);
            return await fetchDefaultTextResources(origin, org, app, fallbackLanguage as string, null, clientLogger, customFields);
        } else {
            // No valid fallback language available, give up
            console.error(`Could not retrieve default text resources for language: ${language}`);
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Could not retrieve default text resources for language: ${language} from URL '${defaultTextResourcesApiUrl}'. Response status: ${response!.status}.`,
                    custom_fields: customFields
                }
            ]);
            return null;
        }
    } catch (error) {
        if (hasValue(fallbackLanguage) && fallbackLanguage !== language) {
            console.error(
                `Network or parsing error while retrieving default text resources for language: ${language} from URL '${defaultTextResourcesApiUrl}', fetching fallback language: ${fallbackLanguage}`,
                error
            );
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Network or parsing error while retrieving default text resources for language: ${language} from URL '${defaultTextResourcesApiUrl}', fetching fallback language: ${fallbackLanguage}: ${(error as Error).message}`,
                    custom_fields: customFields
                }
            ]);
            return await fetchDefaultTextResources(origin, org, app, fallbackLanguage as string, null, clientLogger, customFields);
        }
        console.error(
            `Network or parsing error while retrieving default text resources for language: ${language} from URL '${defaultTextResourcesApiUrl}'`,
            error
        );
        clientLogger?.postLogData([
            {
                level: "Error",
                message: `Network or parsing error while retrieving default text resources for language: ${language} from URL '${defaultTextResourcesApiUrl}': ${(error as Error).message}`,
                custom_fields: customFields
            }
        ]);
        return null;
    }
};
