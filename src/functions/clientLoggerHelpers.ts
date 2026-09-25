// Dependencies
import { ClientLogger } from "@arkitektum/client-logger";
import type { LogCustomField } from "../types.ts";

// Constants
import { altinnAppOrigins, clientLoggerApiUrls } from "../constants/urls.ts";

/**
 * Fetch with timeout and client logger integration.
 *
 * @param url - The URL to fetch.
 * @param options - The fetch options.
 * @param timeout - The timeout in milliseconds.
 * @param clientLogger - The client logger instance, when there is one to log through.
 * @param customFields - Extra fields carried on every log entry this call makes.
 * @returns The fetch response, or nothing when the request failed: the failure is logged rather than thrown, so
 *   a page that cannot reach something still renders.
 */
export async function fetchWithTimeoutAndClientLogger(
    url: string,
    options: RequestInit = {},
    timeout = 3000,
    clientLogger: ClientLogger | null = null,
    customFields: LogCustomField[] = []
): Promise<Response | undefined> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const startTimeStamp = Date.now();
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        const endTimeStamp = Date.now();
        const duration = endTimeStamp - startTimeStamp;
        clientLogger?.postLogData([
            {
                level: "Information",
                message: `Fetched URL: ${url} with status: ${response.status}`,
                custom_fields: [...customFields, { key: "duration", value: duration.toString() }]
            }
        ]);
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if ((error as Error).name === "AbortError") {
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Request to ${url} timed out after ${timeout}ms`,
                    custom_fields: customFields
                }
            ]);
            console.error(`Request to ${url} timed out after ${timeout}ms`);
        } else {
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Request to ${url} failed with error: ${(error as Error).message}`,
                    custom_fields: customFields
                }
            ]);
            console.error(`Request to ${url} failed with error: ${(error as Error).message}`);
        }
    }
}

/**
 * Get the client logger API URL based on the current origin.
 *
 * @returns {string} The client logger API URL.
 */
function getClientLoggerApiUrl() {
    const origin = globalThis.location.origin;
    switch (origin) {
        case altinnAppOrigins.local:
            return clientLoggerApiUrls.local;
        case altinnAppOrigins.test:
            return clientLoggerApiUrls.test;
        case altinnAppOrigins.production:
            return clientLoggerApiUrls.production;
        default:
            console.warn(`Unrecognized origin '${origin}', defaulting client logger API URL to '${clientLoggerApiUrls.default}'`);
            return clientLoggerApiUrls.default;
    }
}

/**
 * Get an instance of the ClientLogger.
 *
 * @param {*} app
 * @param {*} instanceId
 * @returns {ClientLogger} An instance of the ClientLogger.
 */
export function getClientLoggerInstance() {
    const apiUrl = getClientLoggerApiUrl();
    const appName = "a3-pdf";
    // The package declares the source map argument as a string, but it is optional in practice and this call has
    // never had one. The assertion is erased at build time, so nothing about the call changes.
    const clientLogger = new ClientLogger(apiUrl, null as unknown as string, appName);
    return clientLogger;
}
