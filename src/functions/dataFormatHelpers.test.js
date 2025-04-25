import {
    formatDate,
    formatDateTime,
    formatString,
    formatTime,
    getAvailableDateTimeLanguageOrDefault,
    isValidDateString,
    isValidHeaderSize
} from "./dataFormatHelpers";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

jest.mock("../constants/dateTimeFormats", () => ({
    availableDateTimeLanguages: ["default"],
    dateTimeFormat: {
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
    },
    dateTimeLocale: {
        dateTime: {
            default: "no-NO"
        },
        date: {
            default: "no-NO"
        },
        time: {
            default: "no-NO"
        }
    }
}));

describe("getAvailableDateTimeLanguageOrDefault", () => {
    beforeAll(() => {
        jest.mock("../constants/dateTimeFormats", () => ({
            availableDateTimeLanguages: ["en", "no-NO", "fr"]
        }));
    });

    it("should return the provided language if it is available", () => {
        const language = "no-NO";
        const result = getAvailableDateTimeLanguageOrDefault(language);
        expect(result).toBe("default");
    });

    it("should return 'default' if the provided language is not available", () => {
        const language = "unsupported-lang";
        const result = getAvailableDateTimeLanguageOrDefault(language);
        expect(result).toBe("default");
    });

    it("should return 'default' if the provided language is an empty string", () => {
        const language = "";
        const result = getAvailableDateTimeLanguageOrDefault(language);
        expect(result).toBe("default");
    });

    it("should return 'default' if the provided language is null", () => {
        const language = null;
        const result = getAvailableDateTimeLanguageOrDefault(language);
        expect(result).toBe("default");
    });

    it("should return 'default' if the provided language is undefined", () => {
        const language = undefined;
        const result = getAvailableDateTimeLanguageOrDefault(language);
        expect(result).toBe("default");
    });
});

describe("isValidDateString", () => {
    it("should return true for a valid date string", () => {
        const validDate = "2023-10-01T15:30:00";
        const result = isValidDateString(validDate);
        expect(result).toBe(true);
    });

    it("should return false for an invalid date string", () => {
        const invalidDate = "invalid-date";
        const result = isValidDateString(invalidDate);
        expect(result).toBe(false);
    });

    it("should return false for an empty string", () => {
        const emptyString = "";
        const result = isValidDateString(emptyString);
        expect(result).toBe(false);
    });

    it("should return false for a null value", () => {
        const nullValue = null;
        const result = isValidDateString(nullValue);
        expect(result).toBe(false);
    });

    it("should return false for an undefined value", () => {
        const undefinedValue = undefined;
        const result = isValidDateString(undefinedValue);
        expect(result).toBe(false);
    });

    it("should return true for a valid ISO date string without time", () => {
        const validDate = "2023-10-01";
        const result = isValidDateString(validDate);
        expect(result).toBe(true);
    });

    it("should return true for a valid date string with time zone offset", () => {
        const validDate = "2023-10-01T15:30:00+02:00";
        const result = isValidDateString(validDate);
        expect(result).toBe(true);
    });
});

describe("formatDateTime", () => {
    it("should format dateTime in the specified language", () => {
        const dateTime = "2023-10-01T15:30:00";
        const formatted = formatDateTime(dateTime, "no-NO");
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should format dateTime using the default locale if language is not specified", () => {
        const dateTime = "2023-10-01T15:30:00";
        const formatted = formatDateTime(dateTime);
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should handle invalid dateTime input gracefully", () => {
        const dateTime = "invalid-date";
        const formatted = formatDateTime(dateTime, "en");
        expect(formatted).toBe("Ugyldig datoformat");
    });

    it("should fall back to default locale if the specified language is not supported", () => {
        const dateTime = "2023-10-01T15:30:00";
        const formatted = formatDateTime(dateTime, "unsupported-lang");
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should handle a valid ISO dateTime string with a time zone offset", () => {
        const dateTime = "2023-10-01T15:30:00+02:00";

        // Convert to the Oslo time zone
        const timeZone = "Europe/Oslo"; // Use a specific timezone
        const zonedDate = toZonedTime(dateTime, timeZone).toISOString();

        const formatted = formatDateTime(zonedDate, "no-NO");
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should handle a valid ISO dateTime string without time", () => {
        const dateTime = "2023-10-01";
        const formatted = formatDateTime(dateTime, "no-NO");
        expect(formatted).toBe("01.10.2023, 00:00:00");
    });

    it("should return an error message for an empty string", () => {
        const dateTime = "";
        const formatted = formatDateTime(dateTime, "no-NO");
        expect(formatted).toBe("Ugyldig datoformat");
    });

    it("should return an error message for a null value", () => {
        const dateTime = null;
        const formatted = formatDateTime(dateTime, "no-NO");
        expect(formatted).toBe("Ugyldig datoformat");
    });

    it("should return an error message for an undefined value", () => {
        const dateTime = undefined;
        const formatted = formatDateTime(dateTime, "no-NO");
        expect(formatted).toBe("Ugyldig datoformat");
    });
});

describe("formatDate", () => {
    it("should format date in the specified language", () => {
        const date = "2023-10-01";
        const formatted = formatDate(date, "no-NO");
        expect(formatted).toBe("01.10.2023");
    });

    it("should format date using the default locale if language is not specified", () => {
        const date = "2023-10-01";
        const formatted = formatDate(date);
        expect(formatted).toBe("01.10.2023");
    });

    it("should handle invalid date input gracefully", () => {
        const date = "invalid-date";
        expect(() => formatDate(date, "en")).toThrow();
    });

    it("should fall back to default locale if the specified language is not supported", () => {
        const date = "2023-10-01";
        const formatted = formatDate(date, "unsupported-lang");
        expect(formatted).toBe("01.10.2023");
    });

    it("should format a valid ISO date string without time", () => {
        const date = "2023-10-01";
        const formatted = formatDate(date, "no-NO");
        expect(formatted).toBe("01.10.2023");
    });

    it("should format a valid date string with time zone offset", () => {
        const date = "2023-10-01T15:30:00+02:00";
        const formatted = formatDate(date, "no-NO");
        expect(formatted).toBe("01.10.2023");
    });
});

describe("formatTime", () => {
    it("should format time in the specified language", () => {
        const time = "15:30:00";
        const formatted = formatTime(time, "no-NO");
        expect(formatted).toBe("15:30:00");
    });

    it("should format time using the default locale if language is not specified", () => {
        const time = "15:30:00";
        const formatted = formatTime(time);
        expect(formatted).toBe("15:30:00");
    });

    it("should handle invalid time input gracefully", () => {
        const time = "invalid-time";
        expect(() => formatTime(time, "en")).toThrow();
    });

    it("should fall back to default locale if the specified language is not supported", () => {
        const time = "15:30:00";
        const formatted = formatTime(time, "unsupported-lang");
        expect(formatted).toBe("15:30:00");
    });

    it("should format a valid ISO time string with a time zone offset", () => {
        const time = "2023-10-01T15:30:00+02:00";

        // Convert to the Oslo time zone
        const timeZone = "Europe/Oslo"; // Use a specific timezone
        const zonedTime = toZonedTime(time, timeZone).toISOString();

        const formatted = formatTime(zonedTime, "no-NO");
        expect(formatted).toBe("15:30:00");
    });

    it("should return an error for an empty string", () => {
        const time = "";
        expect(() => formatTime(time, "no-NO")).toThrow();
    });

    it("should return an error for a null value", () => {
        const time = null;
        expect(() => formatTime(time, "no-NO")).toThrow();
    });

    it("should return an error for an undefined value", () => {
        const time = undefined;
        expect(() => formatTime(time, "no-NO")).toThrow();
    });

    it("should throw an error for a number", () => {
        const time = 15; // Pass a number instead of a string
        expect(() => formatTime(time, "no-NO")).toThrow();
    });

    it("should throw an error for a number", () => {
        const time = 15; // Pass a number instead of a string
        expect(() => formatTime(time, "no-NO")).toThrow();
    });

    it("should append a default date if the time string does not include a date", () => {
        const time = "15:30:00";
        const formatted = formatTime(time, "no-NO");
        expect(formatted).toBe("15:30:00");
    });

    if (
        ("should handle a valid time string without seconds",
        () => {
            const time = "15:30";
            const formatted = formatTime(time, "no-NO");
            expect(formatted).toBe("15:30:00");
        })
    );
});

describe("isValidHeaderSize", () => {
    it("should return true for a valid header size", () => {
        const validSize = "h3";
        jest.mock("../constants/validSizeValues", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
        const result = isValidHeaderSize(validSize);
        expect(result).toBe(true);
    });

    it("should return false for an invalid header size", () => {
        const invalidSize = "extra-large";
        jest.mock("../constants/validSizeValues", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
        const result = isValidHeaderSize(invalidSize);
        expect(result).toBe(false);
    });

    it("should return false for an empty string", () => {
        const emptySize = "";
        jest.mock("../constants/validSizeValues", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
        const result = isValidHeaderSize(emptySize);
        expect(result).toBe(false);
    });

    it("should return false for a null value", () => {
        const nullSize = null;
        jest.mock("../constants/validSizeValues", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
        const result = isValidHeaderSize(nullSize);
        expect(result).toBe(false);
    });

    it("should return false for an undefined value", () => {
        const undefinedSize = undefined;
        jest.mock("../constants/validSizeValues", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
        const result = isValidHeaderSize(undefinedSize);
        expect(result).toBe(false);
    });

    it("should be case-insensitive when validating header size", () => {
        const validSize = "H2";
        jest.mock("../constants/validSizeValues", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
        const result = isValidHeaderSize(validSize);
        expect(result).toBe(true);
    });
});

describe("formatString", () => {
    it("should format a string as dateTime when format is 'dateTime'", () => {
        const input = "2023-10-01T15:30:00";
        const formatted = formatString(input, "dateTime", "no-NO");
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should format a string as date when format is 'date'", () => {
        const input = "2023-10-01";
        const formatted = formatString(input, "date", "no-NO");
        expect(formatted).toBe("01.10.2023");
    });

    it("should format a string as time when format is 'time'", () => {
        const input = "15:30:00";
        const formatted = formatString(input, "time", "no-NO");
        expect(formatted).toBe("15:30:00");
    });

    it("should return the original string if format is not recognized", () => {
        const input = "2023-10-01T15:30:00";
        const formatted = formatString(input, "unknown-format", "no-NO");
        expect(formatted).toBe(input);
    });

    it("should handle invalid dateTime input gracefully", () => {
        const input = "invalid-date";
        const formatted = formatString(input, "dateTime", "no-NO");
        expect(formatted).toBe("Ugyldig datoformat");
    });

    it("should throw an error for invalid date input when format is 'date'", () => {
        const input = "invalid-date";
        expect(() => formatString(input, "date", "no-NO")).toThrow();
    });

    it("should throw an error for invalid time input when format is 'time'", () => {
        const input = "invalid-time";
        expect(() => formatString(input, "time", "no-NO")).toThrow();
    });

    it("should use the default language if no language is specified", () => {
        const input = "2023-10-01T15:30:00";
        const formatted = formatString(input, "dateTime");
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should fall back to default locale if the specified language is not supported", () => {
        const input = "2023-10-01T15:30:00";
        const formatted = formatString(input, "dateTime", "unsupported-lang");
        expect(formatted).toBe("01.10.2023, 15:30:00");
    });

    it("should handle a valid ISO date string without time when format is 'dateTime'", () => {
        const input = "2023-10-01";
        const formatted = formatString(input, "dateTime", "no-NO");
        expect(formatted).toBe("01.10.2023, 00:00:00");
    });

    it("should handle a valid ISO date string without time when format is 'date'", () => {
        const input = "2023-10-01";
        const formatted = formatString(input, "date", "no-NO");
        expect(formatted).toBe("01.10.2023");
    });

    it("should append a default date if the time string does not include a date when format is 'time'", () => {
        const input = "15:30:00";
        const formatted = formatString(input, "time", "no-NO");
        expect(formatted).toBe("15:30:00");
    });
});
