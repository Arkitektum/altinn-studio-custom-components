import { formatName } from "./functions";

describe("formatName", () => {
    it("should return only the name when hideOrgNr is true", () => {
        const part = { navn: "Test Name", organisasjonsnummer: "123456789" };
        const result = formatName(part, true);
        expect(result).toBe("Test Name");
    });

    it("should return the name and organizational number when hideOrgNr is false", () => {
        const part = { navn: "Test Name", organisasjonsnummer: "123456789" };
        const result = formatName(part, false);
        expect(result).toBe("Test Name\nOrganisasjonsnummer: 123456789");
    });

    it("should return only the name when organizational number is missing and hideOrgNr is false", () => {
        const part = { navn: "Test Name" };
        const result = formatName(part, false);
        expect(result).toBe("Test Name");
    });

    it("should return an empty string when part is undefined", () => {
        const result = formatName(undefined, false);
        expect(result).toBe("");
    });

    it("should return an empty string when part is null", () => {
        const result = formatName(null, false);
        expect(result).toBe("");
    });

    it("should return an empty string when part.navn is undefined", () => {
        const part = { organisasjonsnummer: "123456789" };
        const result = formatName(part, false);
        expect(result).toBe("");
    });

    it("should handle empty organizational number gracefully", () => {
        const part = { navn: "Test Name", organisasjonsnummer: "" };
        const result = formatName(part, false);
        expect(result).toBe("Test Name");
    });
});
