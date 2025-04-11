import Prosjekt from "./Prosjekt";

describe("Prosjekt", () => {
    it("should create an instance with the given properties", () => {
        const props = { prosjektnavn: "Test Project", prosjektnr: 123 };
        const prosjekt = new Prosjekt(props);

        expect(prosjekt.prosjektnavn).toBe("Test Project");
        expect(prosjekt.prosjektnr).toBe(123);
    });

    it("should handle missing properties gracefully", () => {
        const prosjekt = new Prosjekt();

        expect(prosjekt.prosjektnavn).toBeUndefined();
        expect(prosjekt.prosjektnr).toBeUndefined();
    });

    it("should handle partial properties", () => {
        const props = { prosjektnavn: "Partial Project" };
        const prosjekt = new Prosjekt(props);

        expect(prosjekt.prosjektnavn).toBe("Partial Project");
        expect(prosjekt.prosjektnr).toBeUndefined();
    });
});
