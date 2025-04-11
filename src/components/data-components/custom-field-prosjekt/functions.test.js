import { formatProsjekt } from "./functions";

describe("formatProsjekt", () => {
    it("should format a project with both name and number", () => {
        const prosjekt = { prosjektnavn: "Project Alpha", prosjektnr: "12345" };
        const result = formatProsjekt(prosjekt);
        expect(result).toBe("Project Alpha (12345)");
    });

    it("should format a project with only a name", () => {
        const prosjekt = { prosjektnavn: "Project Beta" };
        const result = formatProsjekt(prosjekt);
        expect(result).toBe("Project Beta");
    });

    it("should format a project with only a number", () => {
        const prosjekt = { prosjektnr: "67890" };
        const result = formatProsjekt(prosjekt);
        expect(result).toBe("(67890)");
    });

    it("should return an empty string if the project object is empty", () => {
        const prosjekt = {};
        const result = formatProsjekt(prosjekt);
        expect(result).toBe("");
    });

    it("should return an empty string if the project object is null or undefined", () => {
        expect(formatProsjekt(null)).toBe("");
        expect(formatProsjekt(undefined)).toBe("");
    });

    it("should handle unexpected data types gracefully", () => {
        const prosjekt = { prosjektnavn: 123, prosjektnr: true };
        const result = formatProsjekt(prosjekt);
        expect(result).toBe("123 (true)");
    });
});
