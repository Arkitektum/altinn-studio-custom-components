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
 * @param timeout - The timeout in milliseconds, for the whole request: reading the body counts, not only the wait for
 *   the headers, since a response whose body stalls would otherwise hold the caller's `response.json()` indefinitely.
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
    // Not cleared once the headers arrive: the caller reads the body after this returns, and the same abort is what
    // stops that read. Aborting a body that has already been read does nothing, so the timer is left to run out.
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
 * Get the client logger API URL based on the origin the app is served from.
 *
 * @param {string} [origin] - The origin to look up. The page's own unless a test hands it one.
 * @returns {string} The client logger API URL.
 */
export function getClientLoggerApiUrl(origin = globalThis.location.origin) {
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
