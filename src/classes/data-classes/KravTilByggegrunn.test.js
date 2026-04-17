import KravTilByggegrunn from "./KravTilByggegrunn";
import MuligeOmraadeRisikoer from "./MuligeOmraadeRisikoer";

describe("KravTilByggegrunn", () => {
    it("should initialize muligeOmraadeRisikoer as instance if provided", () => {
        const data = { omraadeRisiko: [] };
        const instance = new KravTilByggegrunn({ muligeOmraadeRisikoer: data });
        expect(instance.muligeOmraadeRisikoer).toBeInstanceOf(MuligeOmraadeRisikoer);
    });

    it("should set muligeOmraadeRisikoer as undefined if not provided", () => {
        const instance = new KravTilByggegrunn({});
        expect(instance.muligeOmraadeRisikoer).toBeUndefined();
    });

    it("should set harMiljoeforhold if provided", () => {
        const instance = new KravTilByggegrunn({ harMiljoeforhold: true });
        expect(instance.harMiljoeforhold).toBe(true);
    });

    it("should set harMiljoeforhold as undefined if not provided", () => {
        const instance = new KravTilByggegrunn({});
        expect(instance.harMiljoeforhold).toBeUndefined();
    });

    it("should handle both properties together", () => {
        const data = { omraadeRisiko: [] };
        const instance = new KravTilByggegrunn({ muligeOmraadeRisikoer: data, harMiljoeforhold: false });
        expect(instance.muligeOmraadeRisikoer).toBeInstanceOf(MuligeOmraadeRisikoer);
        expect(instance.harMiljoeforhold).toBe(false);
    });
});
