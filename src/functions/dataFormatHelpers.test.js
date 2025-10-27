import {
    getAvailableDateTimeLanguageOrDefault,
    parseDateString,
    parseTimeString,
    isValidDateString,
    formatDateTime,
    formatDate,
    formatTime,
    formatAR,
    formatString,
    isValidHeaderSize,
    injectAnchorElements
} from "./dataFormatHelpers";

// Mocks for constants and helpers
jest.mock("../constants/dateTimeFormats.js", () => ({
    availableDateTimeLanguages: ["en", "no", "default"],
    dateTimeFormat: {
        dateTime: {
            en: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
            no: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" },
            default: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
        },
        date: {
            en: { year: "numeric", month: "2-digit", day: "2-digit" },
            no: { year: "numeric", month: "2-digit", day: "2-digit" },
            default: { year: "numeric", month: "2-digit", day: "2-digit" }
        },
        time: {
            en: { hour: "2-digit", minute: "2-digit", second: "2-digit" },
            no: { hour: "2-digit", minute: "2-digit", second: "2-digit" },
            default: { hour: "2-digit", minute: "2-digit", second: "2-digit" }
        }
    },
    dateTimeLocale: {
        dateTime: { en: "en", no: "no", default: "en" },
        date: { en: "en", no: "no", default: "en" },
        time: { en: "en", no: "no", default: "en" }
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
        expect(parseDateString("01.02.2023")).toBe("2023-02-01T00:00:00.000Z");
        expect(parseDateString("31.12.1999")).toBe("1999-12-31T00:00:00.000Z");
    });
    it("returns null for invalid date format", () => {
        expect(parseDateString("2023-02-01")).toBeNull();
        expect(parseDateString("32.01.2024")).toBeNull();
        expect(parseDateString("01.13.2023")).toBeNull();
        expect(parseDateString("abc")).toBeNull();
    });
});

describe("parseTimeString", () => {
    it("parses valid hh:mm time", () => {
        expect(parseTimeString("13:45")).toBe("1970-01-01T13:45:00.000Z");
        expect(parseTimeString("00:00")).toBe("1970-01-01T00:00:00.000Z");
    });
    it("parses valid hh:mm:ss time", () => {
        expect(parseTimeString("23:59:59")).toBe("1970-01-01T23:59:59.000Z");
    });
    it("returns null for invalid time", () => {
        expect(parseTimeString("24:00")).toBeNull();
        expect(parseTimeString("12:60")).toBeNull();
        expect(parseTimeString("12:34:60")).toBeNull();
        expect(parseTimeString("abc")).toBeNull();
    });
});

describe("isValidDateString", () => {
    it("returns true for valid ISO date", () => {
        expect(isValidDateString("2023-02-01T00:00:00.000Z")).toBe(true);
        expect(isValidDateString("1999-12-31")).toBe(true);
    });
    it("returns false for invalid date", () => {
        expect(isValidDateString("not-a-date")).toBe(false);
        expect(isValidDateString("")).toBe(false);
        expect(isValidDateString(null)).toBe(false);
    });
});

describe("formatDateTime", () => {
    it("formats valid dateTime string", () => {
        const result = formatDateTime("2023-02-01T13:45:00.000Z", "en");
        expect(typeof result).toBe("string");
    });
    it("appends time if missing", () => {
        const result = formatDateTime("2023-02-01", "en");
        expect(typeof result).toBe("string");
    });
    it("returns error message for invalid date", () => {
        expect(formatDateTime("not-a-date")).toBe("Ugyldig datoformat");
    });
});

describe("formatDate", () => {
    it("formats valid date string", () => {
        const result = formatDate("2023-02-01", "en");
        expect(typeof result).toBe("string");
    });
    it("parses and formats dd.mm.yyyy", () => {
        const result = formatDate("01.02.2023", "en");
        expect(typeof result).toBe("string");
    });
    it("returns formatted date for Date object", () => {
        const result = formatDate(new Date("2023-02-01T00:00:00.000Z"), "en");
        expect(typeof result).toBe("string");
    });
});

describe("formatTime", () => {
    it("formats valid time string with date", () => {
        const result = formatTime("1970-01-01T13:45:00", "en");
        expect(typeof result).toBe("string");
    });
    it("formats valid time string without date", () => {
        const result = formatTime("13:45:00", "en");
        expect(typeof result).toBe("string");
    });
    it("parses and formats invalid time string", () => {
        const result = formatTime("13:45", "en");
        expect(typeof result).toBe("string");
    });
});

describe("formatAR", () => {
    it("returns substring after last dash", () => {
        expect(formatAR("abc-def-ghi")).toBe("ghi");
        expect(formatAR("abc-def")).toBe("def");
        expect(formatAR("abc")).toBe("abc");
    });
    it("trims whitespace", () => {
        expect(formatAR("abc- def ")).toBe("def");
    });
    it("returns undefined for empty input", () => {
        expect(formatAR(undefined)).toBeUndefined();
        expect(formatAR(null)).toBeUndefined();
    });
});

describe("formatString", () => {
    it("formats dateTime", () => {
        expect(typeof formatString("2023-02-01T13:45:00.000Z", "dateTime", "en")).toBe("string");
    });
    it("formats date", () => {
        expect(typeof formatString("2023-02-01", "date", "en")).toBe("string");
    });
    it("formats time", () => {
        expect(typeof formatString("13:45:00", "time", "en")).toBe("string");
    });
    it("formats AR", () => {
        expect(formatString("abc-def", "AR")).toBe("def");
    });
    it("returns input for unknown format", () => {
        expect(formatString("abc", "unknown")).toBe("abc");
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

describe("injectAnchorElements", () => {
    it("converts URLs to anchor tags", () => {
        const input = "Visit http://example.com for info.";
        const output = injectAnchorElements(input);
        expect(output).toContain('<a href="http://example.com"');
    });
    it("converts www URLs to anchor tags", () => {
        const input = "Go to www.example.com!";
        const output = injectAnchorElements(input);
        expect(output).toContain('<a href="https://www.example.com"');
    });
    it("escapes HTML in non-link text", () => {
        const input = "Text <b>bold</b> http://x.com";
        const output = injectAnchorElements(input);
        expect(output).toContain("&lt;b&gt;bold&lt;/b&gt;");
    });
    it("handles trailing punctuation", () => {
        const input = "Check http://example.com, and www.test.com!";
        const output = injectAnchorElements(input);
        expect(output).toContain("</a>,");
        expect(output).toContain("</a>!");
    });
    it("returns empty string for empty input", () => {
        expect(injectAnchorElements("")).toBe("");
    });
});
