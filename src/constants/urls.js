/**
 * This module defines constants for API URLs and origins used in the client logger and Altinn app integration.
 * It also provides a function to get the appropriate client logger API URL based on the current origin.
 */
export const clientLoggerApiUrls = {
    local: "https://frontendlogger.ft-dev.dibk.no/log",
    test: "https://frontendlogger.ft-test.dibk.no/log",
    production: "https://frontendlogger.ft.dibk.no/log",
    default: "https://frontendlogger.ft-dev.dibk.no/log"
};

/**
 * Constants for Altinn app origins, used to determine the appropriate client logger API URL and for other origin-specific logic.
 * The keys represent different deployment environments, and the values are the corresponding origins.
 */
export const altinnAppOrigins = {
    local: "http://local.altinn.cloud",
    test: "https://dibk.apps.tt02.altinn.no",
    production: "https://dibk.apps.altinn.no"
};
