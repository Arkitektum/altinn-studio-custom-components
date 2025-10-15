import Plan from "./Plan";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Plan", () => {
    beforeEach(() => {
        Kode.mockClear();
    });

    it("should set navn and plantype when props are provided", () => {
        const plantypeObj = { code: "A", description: "Type A" };
        const plan = new Plan({ navn: "Testplan", plantype: plantypeObj });

        expect(plan.navn).toBe("Testplan");
        expect(Kode).toHaveBeenCalledWith(plantypeObj);
        expect(plan.plantype).toBeInstanceOf(Kode);
    });

    it("should set navn and plantype to undefined when props is undefined", () => {
        const plan = new Plan();

        expect(plan.navn).toBeUndefined();
        expect(plan.plantype).toBeUndefined();
    });

    it("should set navn and plantype to undefined when props is null", () => {
        const plan = new Plan(null);

        expect(plan.navn).toBeUndefined();
        expect(plan.plantype).toBeUndefined();
    });

    it("should set navn and plantype to undefined when props has no relevant fields", () => {
        const plan = new Plan({ irrelevant: "value" });

        expect(plan.navn).toBeUndefined();
        expect(plan.plantype).toBeUndefined();
    });

    it("should set navn when only navn is provided", () => {
        const plan = new Plan({ navn: "OnlyNavn" });

        expect(plan.navn).toBe("OnlyNavn");
        expect(plan.plantype).toBeUndefined();
    });

    it("should set plantype when only plantype is provided", () => {
        const plantypeObj = { code: "B" };
        const plan = new Plan({ plantype: plantypeObj });

        expect(plan.navn).toBeUndefined();
        expect(Kode).toHaveBeenCalledWith(plantypeObj);
        expect(plan.plantype).toBeInstanceOf(Kode);
    });
});
