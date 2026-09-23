import AndrePlaner from "./AndrePlaner.js";
import Plan from "./Plan.js";

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
        // The mock has to produce a plan with something in it. AndrePlaner drops plans that hold nothing, and a bare
        // automocked instance holds nothing, so without this the filter would remove them and the mapping would look
        // broken when it is working.
        Plan.mockImplementation(function (props) {
            this.navn = `Plan ${props.id}`;
        });
        const planItems = [{ id: 1 }, { id: 2 }];

        const andrePlaner = new AndrePlaner({ plan: planItems });

        expect(andrePlaner.plan).toHaveLength(planItems.length);
        expect(Plan).toHaveBeenCalledTimes(planItems.length);
        expect(Plan).toHaveBeenNthCalledWith(1, planItems[0]);
        expect(Plan).toHaveBeenNthCalledWith(2, planItems[1]);
    });

    it("should drop plan items that hold nothing", () => {
        // Which is what the filter in the constructor is for: an empty plan is not worth carrying or rendering.
        Plan.mockImplementation(function (props) {
            if (props.id === 2) {
                this.navn = "Plan 2";
            }
        });

        const andrePlaner = new AndrePlaner({ plan: [{ id: 1 }, { id: 2 }] });

        expect(andrePlaner.plan).toHaveLength(1);
        expect(andrePlaner.plan[0].navn).toBe("Plan 2");
    });

    it("should handle empty plan array", () => {
        const andrePlaner = new AndrePlaner({ plan: [] });
        expect(Array.isArray(andrePlaner.plan)).toBe(true);
        expect(andrePlaner.plan).toHaveLength(0);
    });
});
