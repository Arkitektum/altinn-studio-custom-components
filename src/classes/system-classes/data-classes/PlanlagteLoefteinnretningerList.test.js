import PlanlagteLoefteinnretningerList from "./PlanlagteLoefteinnretningerList";
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

// Mock getTextResourceFromResourceBinding
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((resource) => `Text for ${resource}`)
}));

describe("PlanlagteLoefteinnretningerList", () => {
    const resourceBindings = {
        planleggesHeis: { title: "heis" },
        planleggesLoefteplattform: { title: "lofteplattform" },
        planleggesRulletrapp: { title: "rulletrapp" },
        planleggesTrappeheis: { title: "trappeheis" }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns correct text resources for all true flags", () => {
        const loefteinnretninger = {
            planleggesHeis: true,
            planleggesLoefteplattform: true,
            planleggesRulletrapp: true,
            planleggesTrappeheis: true
        };
        const list = new PlanlagteLoefteinnretningerList(loefteinnretninger, resourceBindings);
        expect(list.resourceValues.data).toEqual(["Text for heis", "Text for lofteplattform", "Text for rulletrapp", "Text for trappeheis"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("returns only selected text resources for some true flags", () => {
        const loefteinnretninger = {
            planleggesHeis: true,
            planleggesLoefteplattform: false,
            planleggesRulletrapp: true,
            planleggesTrappeheis: false
        };
        const list = new PlanlagteLoefteinnretningerList(loefteinnretninger, resourceBindings);
        expect(list.resourceValues.data).toEqual(["Text for heis", "Text for rulletrapp"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });

    it("returns empty array when all flags are false", () => {
        const loefteinnretninger = {
            planleggesHeis: false,
            planleggesLoefteplattform: false,
            planleggesRulletrapp: false,
            planleggesTrappeheis: false
        };
        const list = new PlanlagteLoefteinnretningerList(loefteinnretninger, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing properties gracefully", () => {
        const loefteinnretninger = {};
        const list = new PlanlagteLoefteinnretningerList(loefteinnretninger, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing resourceBindings gracefully", () => {
        const loefteinnretninger = {
            planleggesHeis: true,
            planleggesLoefteplattform: true
        };
        const list = new PlanlagteLoefteinnretningerList(loefteinnretninger, {});
        expect(list.resourceValues.data).toEqual(["Text for undefined", "Text for undefined"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });
});
