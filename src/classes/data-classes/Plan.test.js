import Plan from "./Plan.js";
import Kode from "./Kode.js";
import { hasValue } from "../../functions/helpers.js";

// Mock hasValue and Kode for isolated testing
jest.mock("../../functions/helpers.js", () => ({
    hasValue: jest.fn()
}));
jest.mock("./Kode.js");

describe("Plan", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should not set properties if neither navn nor plantype.kodebeskrivelse has value", () => {
        hasValue.mockReturnValue(false);
        const plan = new Plan({});
        expect(plan.navn).toBeUndefined();
        expect(plan.plantype).toBeUndefined();
    });

    it("should set navn if navn has value", () => {
        hasValue.mockImplementation((val) => val === "Testnavn");
        const plan = new Plan({ navn: "Testnavn" });
        expect(plan.navn).toBe("Testnavn");
        expect(plan.plantype).toBeUndefined();
    });

    it("should set plantype if plantype.kodebeskrivelse has value", () => {
        // First call: hasNavn (false), second call: hasPlantype (true)
        hasValue.mockImplementationOnce(() => false).mockImplementationOnce(() => true);

        const plantype = { kodebeskrivelse: "desc", kode: "123" };
        const plan = new Plan({ plantype });
        expect(plan.navn).toBeUndefined();
        expect(Kode).toHaveBeenCalledWith(plantype);
        expect(plan.plantype).toBeInstanceOf(Kode);
    });

    it("should set both navn and plantype if both have value", () => {
        // First call: hasNavn (true), second call: hasPlantype (true)
        hasValue.mockImplementationOnce(() => true).mockImplementationOnce(() => true);

        const plantype = { kodebeskrivelse: "desc", kode: "123" };
        const plan = new Plan({ navn: "Testnavn", plantype });
        expect(plan.navn).toBe("Testnavn");
        expect(Kode).toHaveBeenCalledWith(plantype);
        expect(plan.plantype).toBeInstanceOf(Kode);
    });

    it("should handle undefined props gracefully", () => {
        hasValue.mockReturnValue(false);
        const plan = new Plan(undefined);
        expect(plan.navn).toBeUndefined();
        expect(plan.plantype).toBeUndefined();
    });
});
