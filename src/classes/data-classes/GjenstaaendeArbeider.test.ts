import GjenstaaendeArbeider from "./GjenstaaendeArbeider.ts";

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
});
