// Dependencies
import { ClientLogger } from "@arkitektum/client-logger";

/**
 * Fetch with timeout and client logger integration.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} options - The fetch options.
 * @param {number} timeout - The timeout in milliseconds.
 * @param {ClientLogger} clientLogger - The client logger instance.
 * @returns {Promise<Response>} - The fetch response.
 */
export async function fetchWithTimeoutAndClientLogger(url, options = {}, timeout = 3000, clientLogger = null, customFields = []) {
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
        if (error.name === "AbortError") {
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
                    message: `Request to ${url} failed with error: ${error.message}`,
                    custom_fields: customFields
                }
            ]);
            console.error(`Request to ${url} failed with error: ${error.message}`);
        }
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
    const apiUrl = "https://frontendlogger.ft-dev.dibk.no/log";
    const appName = "a3-pdf";
    const clientLogger = new ClientLogger(apiUrl, null, appName);
    return clientLogger;
}
