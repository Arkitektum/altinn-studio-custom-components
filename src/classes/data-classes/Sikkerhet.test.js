import Sikkerhet from "./Sikkerhet";

describe("Sikkerhet", () => {
    it("should initialize all properties when all props are provided", () => {
        const props = {
            harTilstrekkeligSikkerhet: true,
            typeArbeider: "Elektriker",
            utfoertInnen: "2024-12-31"
        };
        const sikkerhet = new Sikkerhet(props);

        expect(sikkerhet.harTilstrekkeligSikkerhet).toBe(true);
        expect(sikkerhet.typeArbeider).toBe("Elektriker");
        expect(sikkerhet.utfoertInnen).toBe("2024-12-31");
    });

    it("should set properties to undefined if not provided", () => {
        const sikkerhet = new Sikkerhet({});
        expect(sikkerhet.harTilstrekkeligSikkerhet).toBeUndefined();
        expect(sikkerhet.typeArbeider).toBeUndefined();
        expect(sikkerhet.utfoertInnen).toBeUndefined();
    });

    it("should handle missing props argument gracefully", () => {
        const sikkerhet = new Sikkerhet();
        expect(sikkerhet.harTilstrekkeligSikkerhet).toBeUndefined();
        expect(sikkerhet.typeArbeider).toBeUndefined();
        expect(sikkerhet.utfoertInnen).toBeUndefined();
    });

    it("should allow harTilstrekkeligSikkerhet to be false", () => {
        const sikkerhet = new Sikkerhet({ harTilstrekkeligSikkerhet: false });
        expect(sikkerhet.harTilstrekkeligSikkerhet).toBe(false);
    });

    it("should allow typeArbeider and utfoertInnen to be empty strings", () => {
        const sikkerhet = new Sikkerhet({ typeArbeider: "", utfoertInnen: "" });
        expect(sikkerhet.typeArbeider).toBe("");
        expect(sikkerhet.utfoertInnen).toBe("");
    });
});
