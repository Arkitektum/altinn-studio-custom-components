export const availableDateTimeLanguages: string[] = ["default"];

/**
 * The time zone a moment in time is shown in, so a timestamp written with `Z` or an offset reads the same in Norway
 * whatever zone the machine rendering it is set to. Values without an offset are wall-clock values and are not moved.
 */
export const dateTimeZone = "Europe/Oslo";

/** The Intl options each kind of value is formatted with, keyed by locale. Every kind has a `default`. */
export const dateTimeFormat: Record<"dateTime" | "date" | "time", Record<string, Intl.DateTimeFormatOptions>> = {
    dateTime: {
        default: {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    },
    date: {
        default: {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    },
    time: {
        default: {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    }
};

/** The Intl locale each kind of value is formatted in, keyed by language. Every kind has a `default`. */
export const dateTimeLocale: Record<"dateTime" | "date" | "time", Record<string, string>> = {
    dateTime: {
        default: "no-NO"
    },
    date: {
        default: "no-NO"
    },
    time: {
        default: "no-NO"
    }
};
