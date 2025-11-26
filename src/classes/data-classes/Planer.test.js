import Planer from "./Planer";
import AndrePlaner from "./AndrePlaner";
import Plan from "./Plan";

jest.mock("./AndrePlaner");
jest.mock("./Plan");

describe("Planer", () => {
    beforeEach(() => {
        AndrePlaner.mockClear();
        Plan.mockClear();
    });

    it("should initialize andrePlaner and gjeldendePlan when props are provided", () => {
        const andrePlanerData = { foo: "bar" };
        const gjeldendePlanData = { baz: "qux" };

        const planer = new Planer({
            andrePlaner: andrePlanerData,
            gjeldendePlan: gjeldendePlanData
        });

        expect(AndrePlaner).toHaveBeenCalledWith(andrePlanerData);
        expect(Plan).toHaveBeenCalledWith(gjeldendePlanData);
        expect(planer.andrePlaner).toBeInstanceOf(AndrePlaner);
        expect(planer.gjeldendePlan).toBeInstanceOf(Plan);
    });

    it("should set andrePlaner to undefined if not provided", () => {
        const planer = new Planer({ gjeldendePlan: { foo: "bar" } });
        expect(planer.andrePlaner).toBeUndefined();
        expect(Plan).toHaveBeenCalled();
    });

    it("should set gjeldendePlan to undefined if not provided", () => {
        const planer = new Planer({ andrePlaner: { foo: "bar" } });
        expect(planer.gjeldendePlan).toBeUndefined();
        expect(AndrePlaner).toHaveBeenCalled();
    });

    it("should set both properties to undefined if no props are provided", () => {
        const planer = new Planer({});
        expect(planer.andrePlaner).toBeUndefined();
        expect(planer.gjeldendePlan).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const planer = new Planer();
        expect(planer.andrePlaner).toBeUndefined();
        expect(planer.gjeldendePlan).toBeUndefined();
    });
});
