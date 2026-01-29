import GjenstaaendeArbeider from "./GjenstaaendeArbeider";

describe("GjenstaaendeArbeider", () => {
    it("should set gjenstaaendeInnenfor and gjenstaaendeUtenfor from props", () => {
        const props = {
            gjenstaaendeInnenfor: "innenforValue",
            gjenstaaendeUtenfor: "utenforValue"
        };
        const instance = new GjenstaaendeArbeider(props);
        expect(instance.gjenstaaendeInnenfor).toBe("innenforValue");
        expect(instance.gjenstaaendeUtenfor).toBe("utenforValue");
    });

    it("should set gjenstaaendeInnenfor and gjenstaaendeUtenfor to undefined if not provided", () => {
        const instance = new GjenstaaendeArbeider({});
        expect(instance.gjenstaaendeInnenfor).toBeUndefined();
        expect(instance.gjenstaaendeUtenfor).toBeUndefined();
    });

    it("should handle missing props object gracefully", () => {
        const instance = new GjenstaaendeArbeider();
        expect(instance.gjenstaaendeInnenfor).toBeUndefined();
        expect(instance.gjenstaaendeUtenfor).toBeUndefined();
    });

    it("should allow any type for gjenstaaendeInnenfor and gjenstaaendeUtenfor", () => {
        const props = {
            gjenstaaendeInnenfor: { some: "object" },
            gjenstaaendeUtenfor: [1, 2, 3]
        };
        const instance = new GjenstaaendeArbeider(props);
        expect(instance.gjenstaaendeInnenfor).toEqual({ some: "object" });
        expect(instance.gjenstaaendeUtenfor).toEqual([1, 2, 3]);
    });
});
