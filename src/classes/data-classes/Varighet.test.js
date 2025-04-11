import Varighet from "./Varighet";

describe("Varighet", () => {
    it("should create an instance with default values when no props are provided", () => {
        const instance = new Varighet();
        expect(instance.oenskesVarigDispensasjon).toBeUndefined();
        expect(instance.oensketVarighetTil).toBeUndefined();
    });

    it("should create an instance with the provided props", () => {
        const props = {
            oenskesVarigDispensasjon: true,
            oensketVarighetTil: "2023-12-31"
        };
        const instance = new Varighet(props);
        expect(instance.oenskesVarigDispensasjon).toBe(true);
        expect(instance.oensketVarighetTil).toBe("2023-12-31");
    });

    it("should handle partial props correctly", () => {
        const props = {
            oenskesVarigDispensasjon: false
        };
        const instance = new Varighet(props);
        expect(instance.oenskesVarigDispensasjon).toBe(false);
        expect(instance.oensketVarighetTil).toBeUndefined();
    });
});
