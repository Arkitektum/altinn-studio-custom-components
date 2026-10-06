import {
    formatAR,
    formatDate,
    formatDateTime,
    formatString,
    formatTime,
    getAvailableDateTimeLanguageOrDefault,
    injectAnchorElements,
    isValidDateString,
    parseDateString,
    parseTimeString,
    toDate
} from "./dataFormatHelpers.ts";

// Mocks for constants and helpers
jest.mock("../constants/dateTimeFormats.ts", () => ({
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
jest.mock("./helpers.ts", () => ({
    hasValue: (v: unknown) => v !== undefined && v !== null && v !== ""
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
        expect(isValidDateString("31.02.2024")).toBe(false);
    });
});

describe("toDate", () => {
    it("reads a dotted date day first", () => {
        expect(toDate("05.01.2024")).toEqual(new Date(2024, 0, 5));
        expect(toDate("5.1.2024")).toEqual(new Date(2024, 0, 5));
    });
    it("ignores surrounding whitespace", () => {
        expect(toDate(" 05.01.2024 ")).toEqual(new Date(2024, 0, 5));
    });
    it("reads a date with no time as local midnight", () => {
        expect(toDate("2024-01-05")).toEqual(new Date(2024, 0, 5));
    });
    it("reads a date and time", () => {
        expect(toDate("2024-01-15T10:00:00")).toEqual(new Date(2024, 0, 15, 10, 0, 0));
        expect(toDate("2024-01-15 10:00")).toEqual(new Date(2024, 0, 15, 10, 0, 0));
    });
    it("answers a valid Date as it is", () => {
        const date = new Date(2024, 0, 5);
        expect(toDate(date)).toBe(date);
    });
    it("answers null for dates that do not exist rather than rolling them over", () => {
        expect(toDate("31.02.2024")).toBeNull();
        expect(toDate("2024-02-30")).toBeNull();
        expect(toDate("01.13.2024")).toBeNull();
    });
    it("answers null for anything that is not a date", () => {
        expect(toDate("foo")).toBeNull();
        expect(toDate("")).toBeNull();
        expect(toDate("   ")).toBeNull();
        expect(toDate(null)).toBeNull();
        expect(toDate(undefined)).toBeNull();
        expect(toDate(new Date("foo"))).toBeNull();
    });
});

describe("formatDateTime", () => {
    it("formats a date and time", () => {
        expect(formatDateTime("2024-01-15T10:00:00", "no")).toBe("15.01.2024, 10:00");
    });
    it("formats a date and time written with a space", () => {
        expect(formatDateTime("2024-01-15 10:00", "no")).toBe("15.01.2024, 10:00");
    });
    it("formats a date with no time as midnight", () => {
        expect(formatDateTime("2024-01-15", "no")).toBe("15.01.2024, 00:00");
    });
    it("reads a dotted date day first", () => {
        expect(formatDateTime("05.01.2024", "no")).toBe("05.01.2024, 00:00");
    });
    it("returns error message for invalid date", () => {
        expect(formatDateTime("not-a-date")).toBe("Ugyldig datoformat");
        expect(formatDateTime("31.02.2024")).toBe("Ugyldig datoformat");
    });
    it("returns empty string for empty/undefined input", () => {
        expect(formatDateTime("")).toBe("");
        expect(formatDateTime(undefined)).toBe("");
    });
});

describe("formatDate", () => {
    it("formats an ISO date", () => {
        expect(formatDate("2024-01-05", "no")).toBe("05.01.2024");
    });
    it("reads a dotted date day first", () => {
        expect(formatDate("05.01.2024", "no")).toBe("05.01.2024");
        expect(formatDate("01.02.2023", "no")).toBe("01.02.2023");
    });
    it("formats a Date object", () => {
        expect(formatDate(new Date(2023, 1, 1), "no")).toBe("01.02.2023");
    });
    it("returns error message for a date that does not exist instead of 1970", () => {
        expect(formatDate("31.02.2024", "no")).toBe("Ugyldig datoformat");
        expect(formatDate("foo", "no")).toBe("Ugyldig datoformat");
    });
    it("returns empty string for empty input", () => {
        expect(formatDate("")).toBe("");
        expect(formatDate(null)).toBe("");
    });
});

describe("formatTime", () => {
    it("formats a time with a date", () => {
        expect(formatTime("1970-01-01T13:45:00", "no")).toBe("13:45:00");
    });
    it("formats a bare time with seconds", () => {
        expect(formatTime("13:45:30", "no")).toBe("13:45:30");
    });
    it("formats a bare time without seconds", () => {
        expect(formatTime("13:45", "no")).toBe("13:45:00");
    });
    it("returns error message for a time that does not exist instead of rolling it over", () => {
        expect(formatTime("25:00", "no")).toBe("Ugyldig datoformat");
        expect(formatTime("12:60", "no")).toBe("Ugyldig datoformat");
        expect(formatTime("foo", "no")).toBe("Ugyldig datoformat");
    });
    it("returns empty string for empty/undefined input without throwing", () => {
        expect(formatTime("")).toBe("");
        expect(() => formatTime(undefined)).not.toThrow();
        expect(formatTime(undefined)).toBe("");
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
        expect(formatAR(null as unknown as string)).toBeUndefined();
    });
});

describe("formatString", () => {
    it("formats dateTime", () => {
        expect(formatString("2023-02-01T13:45:00", "dateTime", "no")).toBe("01.02.2023, 13:45");
    });
    it("formats date", () => {
        expect(formatString("2023-02-01", "date", "no")).toBe("01.02.2023");
    });
    it("formats time", () => {
        expect(formatString("13:45:00", "time", "no")).toBe("13:45:00");
    });
    it("formats AR", () => {
        expect(formatString("abc-def", "AR")).toBe("def");
    });
    it("formats meterSquared correctly", () => {
        expect(formatString(123, "meterSquared")).toBe("123 m²");
        expect(formatString("456", "meterSquared")).toBe("456 m²");
    });
    it("formats meterSquared for zero but returns empty for a missing value", () => {
        expect(formatString(0, "meterSquared")).toBe("0 m²");
        expect(formatString("", "meterSquared")).toBe("");
        expect(formatString(undefined, "meterSquared")).toBe("");
    });
    it("returns input for unknown format", () => {
        expect(formatString("abc", "unknown")).toBe("abc");
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
    it("escapes an angle-bracket/quote payload in the URL token so it cannot break out of the anchor", () => {
        const output = injectAnchorElements('http://a.co/"><img src=x onerror=alert(1)>');
        expect(output).not.toContain("<img");
        expect(output).toContain("&lt;img");
        expect(output).toContain("&quot;");
    });
});
