import AndrePlaner from "./AndrePlaner";
import Plan from "./Plan";

jest.mock("./Plan");

describe("AndrePlaner", () => {
    beforeEach(() => {
        Plan.mockClear();
    });

    it("should initialize plan as undefined if props is undefined", () => {
        const andrePlaner = new AndrePlaner();
        expect(andrePlaner.plan).toBeUndefined();
    });

    it("should initialize plan as undefined if props.plan is undefined", () => {
        const andrePlaner = new AndrePlaner({});
        expect(andrePlaner.plan).toBeUndefined();
    });

    it("should map props.plan items to Plan instances", () => {
        const planItems = [{ id: 1 }, { id: 2 }];
        const andrePlaner = new AndrePlaner({ plan: planItems });

        expect(andrePlaner.plan).toHaveLength(planItems.length);
        expect(Plan).toHaveBeenCalledTimes(planItems.length);
        expect(Plan).toHaveBeenNthCalledWith(1, planItems[0]);
        expect(Plan).toHaveBeenNthCalledWith(2, planItems[1]);
    });

    it("should handle empty plan array", () => {
        const andrePlaner = new AndrePlaner({ plan: [] });
        expect(Array.isArray(andrePlaner.plan)).toBe(true);
        expect(andrePlaner.plan).toHaveLength(0);
    });
});
