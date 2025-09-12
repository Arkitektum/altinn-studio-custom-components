import {
    getAvailableDateTimeLanguageOrDefault,
    parseDateString,
    parseTimeString,
    isValidDateString,
    formatDateTime,
    formatDate,
    formatTime,
    formatString,
    isValidHeaderSize,
    injectAnchorElements
} from "./dataFormatHelpers";

// Mock dependencies
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
        dateTime: { en: "en-GB", no: "nb-NO", default: "en-GB" },
        date: { en: "en-GB", no: "nb-NO", default: "en-GB" },
        time: { en: "en-GB", no: "nb-NO", default: "en-GB" }
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
    it("returns null for invalid dates", () => {
        expect(parseDateString("32.01.2023")).toBeNull();
        expect(parseDateString("01.13.2023")).toBeNull();
        expect(parseDateString("abc")).toBeNull();
        expect(parseDateString("2023-01-01")).toBeNull();
        expect(parseDateString("")).toBeNull();
    });
});

describe("parseTimeString", () => {
    it("parses valid hh:mm", () => {
        expect(parseTimeString("13:45")).toBe("1970-01-01T13:45:00.000Z");
        expect(parseTimeString("00:00")).toBe("1970-01-01T00:00:00.000Z");
    });
    it("parses valid hh:mm:ss", () => {
        expect(parseTimeString("23:59:59")).toBe("1970-01-01T23:59:59.000Z");
        expect(parseTimeString("01:02:03")).toBe("1970-01-01T01:02:03.000Z");
    });
    it("returns null for invalid times", () => {
        expect(parseTimeString("24:00")).toBeNull();
        expect(parseTimeString("12:60")).toBeNull();
        expect(parseTimeString("12:34:60")).toBeNull();
        expect(parseTimeString("abc")).toBeNull();
        expect(parseTimeString("")).toBeNull();
    });
});

describe("isValidDateString", () => {
    it("returns true for valid ISO date strings", () => {
        expect(isValidDateString("2023-01-01T00:00:00.000Z")).toBe(true);
        expect(isValidDateString("1999-12-31")).toBe(true);
    });
    it("returns false for invalid date strings", () => {
        expect(isValidDateString("not-a-date")).toBe(false);
        expect(isValidDateString("")).toBe(false);
        expect(isValidDateString(null)).toBe(false);
    });
});

describe("formatDateTime", () => {
    it("formats valid dateTime string", () => {
        const result = formatDateTime("2023-01-02T13:45:00", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
    it("formats date string without time", () => {
        const result = formatDateTime("2023-01-02", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
    it("returns error message for invalid date", () => {
        expect(formatDateTime("not-a-date")).toBe("Ugyldig datoformat");
    });
});

describe("formatDate", () => {
    it("formats ISO date string", () => {
        const result = formatDate("2023-01-02", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
    it("formats dd.mm.yyyy date string", () => {
        const result = formatDate("02.01.2023", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
    it("formats with default language if not available", () => {
        const result = formatDate("2023-01-02", "fr");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
});

describe("formatTime", () => {
    it("formats ISO time string", () => {
        const result = formatTime("1970-01-01T13:45:00", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/13/);
    });
    it("formats hh:mm:ss string", () => {
        const result = formatTime("13:45:30", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/13/);
    });
    it("formats hh:mm string", () => {
        const result = formatTime("13:45", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/13/);
    });
});

describe("formatString", () => {
    it("formats dateTime", () => {
        const result = formatString("2023-01-02T13:45:00", "dateTime", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
    it("formats date", () => {
        const result = formatString("2023-01-02", "date", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/2023/);
    });
    it("formats time", () => {
        const result = formatString("13:45:00", "time", "en");
        expect(typeof result).toBe("string");
        expect(result).toMatch(/13/);
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
    });
});

describe("injectAnchorElements", () => {
    it("converts http(s) URLs to anchor tags", () => {
        const input = "Visit http://example.com for info.";
        const output = injectAnchorElements(input);
        expect(output).toContain('<a href="http://example.com"');
        expect(output).toContain("for info.");
    });
    it("converts www URLs to anchor tags", () => {
        const input = "Go to www.example.com!";
        const output = injectAnchorElements(input);
        expect(output).toContain('<a href="https://www.example.com"');
        expect(output).toContain("</a>!");
    });
    it("escapes HTML in non-link text", () => {
        const input = "Text with <b>bold</b> and www.site.com";
        const output = injectAnchorElements(input);
        expect(output).toContain("&lt;b&gt;bold&lt;/b&gt;");
        expect(output).toContain('<a href="https://www.site.com"');
    });
    it("handles multiple URLs and punctuation", () => {
        const input = "Check www.a.com, http://b.com! Or https://c.com?";
        const output = injectAnchorElements(input);
        expect(output).toContain('<a href="https://www.a.com"');
        expect(output).toContain('<a href="http://b.com"');
        expect(output).toContain('<a href="https://c.com"');
        expect(output).toContain(",");
        expect(output).toContain("!");
        expect(output).toContain("?");
    });
    it("returns empty string for empty input", () => {
        expect(injectAnchorElements("")).toBe("");
    });
});
