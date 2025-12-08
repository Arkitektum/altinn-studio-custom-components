import Overvann from "./Overvann";

describe("Overvann", () => {
    it("should initialize properties from props", () => {
        const props = {
            ledesOvervannTilAvloepssystem: true,
            ledesOvervannTilTerreng: false
        };
        const overvann = new Overvann(props);
        expect(overvann.ledesOvervannTilAvloepssystem).toBe(true);
        expect(overvann.ledesOvervannTilTerreng).toBe(false);
    });

    it("should set properties to undefined if not provided", () => {
        const overvann = new Overvann({});
        expect(overvann.ledesOvervannTilAvloepssystem).toBeUndefined();
        expect(overvann.ledesOvervannTilTerreng).toBeUndefined();
    });

    it("should handle missing props argument", () => {
        const overvann = new Overvann();
        expect(overvann.ledesOvervannTilAvloepssystem).toBeUndefined();
        expect(overvann.ledesOvervannTilTerreng).toBeUndefined();
    });

    it("should handle partial props", () => {
        const overvann = new Overvann({ ledesOvervannTilAvloepssystem: true });
        expect(overvann.ledesOvervannTilAvloepssystem).toBe(true);
        expect(overvann.ledesOvervannTilTerreng).toBeUndefined();
    });
});
