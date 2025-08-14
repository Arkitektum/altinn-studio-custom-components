import {
    getAvailableDateTimeLanguageOrDefault,
    parseDateString,
    parseTimeString,
    isValidDateString,
    formatDateTime,
    formatDate,
    formatTime,
    formatString,
    isValidHeaderSize
} from "./dataFormatHelpers";

// Mock dependencies
jest.mock("../constants/dateTimeFormats.js", () => ({
    availableDateTimeLanguages: ["en", "no", "nb"],
    dateTimeFormat: {
        dateTime: {
            "en-US": { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
            "nb-NO": { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
            default: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
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
        dateTime: { en: "en-US", no: "nb-NO", nb: "nb-NO", default: "en-US" },
        date: { en: "en-US", no: "nb-NO", nb: "nb-NO", default: "en-US" },
        time: { en: "en-US", no: "nb-NO", nb: "nb-NO", default: "en-US" }
    }
}));
jest.mock("../constants/validSizeValues.js", () => ["h1", "h2", "h3", "h4", "h5", "h6"]);
jest.mock("./helpers.js", () => ({
    hasValue: (v) => v !== undefined && v !== null && v !== ""
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

describe("parseDateString", () => {
    it("parses valid dd.mm.yyyy date", () => {
        expect(parseDateString("01.02.2023")).toMatch(/^2023-02-01T00:00:00\.000Z$/);
    });
    it("returns null for invalid date format", () => {
        expect(parseDateString("2023-02-01")).toBeNull();
        expect(parseDateString("32.01.2023")).toBeNull();
        expect(parseDateString("01.13.2023")).toBeNull();
        expect(parseDateString("")).toBeNull();
    });
});

describe("parseTimeString", () => {
    it("parses valid hh:mm time", () => {
        expect(parseTimeString("13:45")).toMatch(/^1970-01-01T13:45:00\.000Z$/);
    });
    it("parses valid hh:mm:ss time", () => {
        expect(parseTimeString("13:45:30")).toMatch(/^1970-01-01T13:45:30\.000Z$/);
    });
    it("returns null for invalid time", () => {
        expect(parseTimeString("24:00")).toBeNull();
        expect(parseTimeString("12:60")).toBeNull();
        expect(parseTimeString("12:30:60")).toBeNull();
        expect(parseTimeString("abc")).toBeNull();
        expect(parseTimeString("")).toBeNull();
    });
});

describe("isValidDateString", () => {
    it("returns true for valid ISO date", () => {
        expect(isValidDateString("2023-02-01T00:00:00.000Z")).toBe(true);
        expect(isValidDateString("2023-02-01")).toBe(true);
    });
    it("returns false for invalid date", () => {
        expect(isValidDateString("not-a-date")).toBe(false);
        expect(isValidDateString("")).toBe(false);
        expect(isValidDateString(null)).toBe(false);
    });
});

describe("formatDateTime", () => {
    it("formats valid dateTime string", () => {
        const result = formatDateTime("2023-02-01T13:45:00", "en");
        expect(typeof result).toBe("string");
    });
    it("formats date string without time", () => {
        const result = formatDateTime("2023-02-01", "en");
        expect(typeof result).toBe("string");
    });
    it("returns error message for invalid date", () => {
        expect(formatDateTime("not-a-date")).toBe("Ugyldig datoformat");
    });
});

describe("formatDate", () => {
    it("formats ISO date string", () => {
        const result = formatDate("2023-02-01", "en");
        expect(typeof result).toBe("string");
    });
    it("formats dd.mm.yyyy date string", () => {
        const result = formatDate("01.02.2023", "en");
        expect(typeof result).toBe("string");
    });
    it("formats with default language if not available", () => {
        const result = formatDate("2023-02-01", "fr");
        expect(typeof result).toBe("string");
    });
});

describe("formatTime", () => {
    it("formats ISO time string", () => {
        const result = formatTime("1970-01-01T13:45:30", "en");
        expect(typeof result).toBe("string");
    });
    it("formats hh:mm:ss time string", () => {
        const result = formatTime("13:45:30", "en");
        expect(typeof result).toBe("string");
    });
    it("formats with default language if not available", () => {
        const result = formatTime("13:45:30", "fr");
        expect(typeof result).toBe("string");
    });
});

describe("formatString", () => {
    it("formats dateTime", () => {
        const result = formatString("2023-02-01T13:45:00", "dateTime", "en");
        expect(typeof result).toBe("string");
    });
    it("formats date", () => {
        const result = formatString("2023-02-01", "date", "en");
        expect(typeof result).toBe("string");
    });
    it("formats time", () => {
        const result = formatString("13:45:30", "time", "en");
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
        expect(isValidHeaderSize("h3")).toBe(true);
    });
    it("returns false for invalid sizes", () => {
        expect(isValidHeaderSize("h7")).toBe(false);
        expect(isValidHeaderSize("")).toBe(false);
        expect(isValidHeaderSize(null)).toBe(false);
        expect(isValidHeaderSize(undefined)).toBe(false);
    });
});
