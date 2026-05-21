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
export async function fetchWithTimeoutAndClientLogger(url, options = {}, timeout = 5000, clientLogger = null) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Request to ${url} timed out after ${timeout}ms`
                }
            ]);
            throw new Error(`Request timed out after ${timeout}ms`, { cause: error });
        } else {
            clientLogger?.postLogData([
                {
                    level: "Error",
                    message: `Request to ${url} failed with error: ${error.message}`
                }
            ]);
        }
        throw error;
    }
}

/**
 * Get an instance of the ClientLogger.
 *
 * @param {*} app
 * @param {*} instanceId
 * @returns {ClientLogger} An instance of the ClientLogger.
 */
export function getClientLoggerInstance(app, instanceId) {
    const apiUrl = "https://frontendlogger.ft-dev.dibk.no/log";
    const appName = "a3-pdf";
    const clientLogger = new ClientLogger(apiUrl, null, appName); // TODO: Pass instanceId and app when supported by the logger backend
    return clientLogger;
}
