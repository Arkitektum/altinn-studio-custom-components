import { formatPhoneNumbers } from "./functions";

describe("formatPhoneNumbers", () => {
    it("should return a single phone number when only telefonnummer is provided", () => {
        const input = { telefonnummer: "12345678", mobilnummer: "" };
        const result = formatPhoneNumbers(input);
        expect(result).toBe("12345678");
    });

    it("should return a single phone number when only mobilnummer is provided", () => {
        const input = { telefonnummer: "", mobilnummer: "87654321" };
        const result = formatPhoneNumbers(input);
        expect(result).toBe("87654321");
    });

    it("should return both phone numbers on separate lines when both are provided", () => {
        const input = { telefonnummer: "12345678", mobilnummer: "87654321" };
        const result = formatPhoneNumbers(input);
        expect(result).toBe("12345678\n87654321");
    });

    it("should return an empty string when both telefonnummer and mobilnummer are empty", () => {
        const input = { telefonnummer: "", mobilnummer: "" };
        const result = formatPhoneNumbers(input);
        expect(result).toBe("");
    });

    it("should handle undefined values gracefully", () => {
        const input = { telefonnummer: undefined, mobilnummer: undefined };
        const result = formatPhoneNumbers(input);
        expect(result).toBe("");
    });

    it("should handle null values gracefully", () => {
        const input = { telefonnummer: null, mobilnummer: null };
        const result = formatPhoneNumbers(input);
        expect(result).toBe("");
    });
});
