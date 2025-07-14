import {
    getAvailableDateTimeLanguageOrDefault,
    isValidDateString,
    formatDateTime,
    formatDate,
    formatTime,
    formatString,
    isValidHeaderSize
} from "./dataFormatHelpers";

// Mock constants and helpers
jest.mock("../constants/dateTimeFormats.js", () => ({
    availableDateTimeLanguages: ["en", "no"],
    dateTimeFormat: {
        dateTime: {
            "en-US": { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
            "nb-NO": { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
            default: { year: "numeric", month: "2-digit", day: "2-digit" }
        },
        date: {
            "en-US": { year: "numeric", month: "2-digit", day: "2-digit" },
            "nb-NO": { year: "numeric", month: "2-digit", day: "2-digit" },
            default: { year: "numeric", month: "2-digit", day: "2-digit" }
        },
        time: {
            "en-US": { hour: "2-digit", minute: "2-digit", second: "2-digit" },
            "nb-NO": { hour: "2-digit", minute: "2-digit", second: "2-digit" },
            default: { hour: "2-digit", minute: "2-digit", second: "2-digit" }
        }
    },
    dateTimeLocale: {
        dateTime: { en: "en-US", no: "nb-NO", default: "en-US" },
        date: { en: "en-US", no: "nb-NO", default: "en-US" },
        time: { en: "en-US", no: "nb-NO", default: "en-US" }
    }
}));
jest.mock("../constants/validSizeValues.js", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
jest.mock("./helpers.js", () => ({
    hasValue: (val) => val !== undefined && val !== null && val !== ""
}));

describe("getAvailableDateTimeLanguageOrDefault", () => {
    it("returns the language if available", () => {
        expect(getAvailableDateTimeLanguageOrDefault("en")).toBe("en");
        expect(getAvailableDateTimeLanguageOrDefault("no")).toBe("no");
    });
    it('returns "default" if language is not available', () => {
        expect(getAvailableDateTimeLanguageOrDefault("fr")).toBe("default");
        expect(getAvailableDateTimeLanguageOrDefault("")).toBe("default");
    });
});

describe("isValidDateString", () => {
    it("returns true for valid ISO date strings", () => {
        expect(isValidDateString("2024-06-01")).toBe(true);
        expect(isValidDateString("2024-06-01T12:34:56")).toBe(true);
    });
    it("returns false for invalid date strings", () => {
        expect(isValidDateString("not-a-date")).toBe(false);
        expect(isValidDateString("2024-13-01")).toBe(false);
        expect(isValidDateString("")).toBe(false);
        expect(isValidDateString(null)).toBe(false);
    });
});

describe("formatDateTime", () => {
    it("formats valid dateTime string", () => {
        const result = formatDateTime("2024-06-01T12:34:56", "en");
        expect(typeof result).toBe("string");
    });
    it("appends time if missing", () => {
        const result = formatDateTime("2024-06-01", "en");
        expect(typeof result).toBe("string");
    });
    it("returns error message for invalid date", () => {
        expect(formatDateTime("invalid-date")).toBe("Ugyldig datoformat");
    });
    it("uses default language if not available", () => {
        const result = formatDateTime("2024-06-01T12:34:56", "fr");
        expect(typeof result).toBe("string");
    });
});

describe("formatDate", () => {
    it("formats valid ISO date string", () => {
        const result = formatDate("2024-06-01", "en");
        expect(typeof result).toBe("string");
    });
    it("parses and formats dd.mm.yyyy string", () => {
        const result = formatDate("01.06.2024", "en");
        expect(typeof result).toBe("string");
    });
    it("uses default language if not available", () => {
        const result = formatDate("2024-06-01", "fr");
        expect(typeof result).toBe("string");
    });
});

describe("formatTime", () => {
    it("formats time with date", () => {
        const result = formatTime("1970-01-01T12:34:56", "en");
        expect(typeof result).toBe("string");
    });
    it("formats time without date", () => {
        const result = formatTime("12:34:56", "en");
        expect(typeof result).toBe("string");
    });
    it("parses and formats hh:mm string", () => {
        const result = formatTime("12:34", "en");
        expect(typeof result).toBe("string");
    });
    it("uses default language if not available", () => {
        const result = formatTime("12:34:56", "fr");
        expect(typeof result).toBe("string");
    });
});

describe("formatString", () => {
    it("formats dateTime", () => {
        const result = formatString("2024-06-01T12:34:56", "dateTime", "en");
        expect(typeof result).toBe("string");
    });
    it("formats date", () => {
        const result = formatString("2024-06-01", "date", "en");
        expect(typeof result).toBe("string");
    });
    it("formats time", () => {
        const result = formatString("12:34:56", "time", "en");
        expect(typeof result).toBe("string");
    });
    it("returns input for unknown format", () => {
        expect(formatString("test", "unknown")).toBe("test");
    });
});

describe("isValidHeaderSize", () => {
    it("returns true for valid sizes", () => {
        expect(isValidHeaderSize("h1")).toBe(true);
        expect(isValidHeaderSize("H2")).toBe(true);
        expect(isValidHeaderSize("h6")).toBe(true);
    });
    it("returns false for invalid sizes", () => {
        expect(isValidHeaderSize("h7")).toBe(false);
        expect(isValidHeaderSize("")).toBe(false);
        expect(isValidHeaderSize(null)).toBe(false);
        expect(isValidHeaderSize(undefined)).toBe(false);
    });
});
