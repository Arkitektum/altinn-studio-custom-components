import CustomHeaderTextData from "./CustomHeaderTextData";
import { getComponentDataTitle, getComponentResourceValue } from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataTitle: jest.fn(),
    getComponentResourceValue: jest.fn()
}));

describe("CustomHeaderTextData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set size from props", () => {
        getComponentResourceValue.mockReturnValue("ResourceTitle");
        getComponentDataTitle.mockReturnValue("DataTitle");
        const instance = new CustomHeaderTextData({ size: "large", title: "Header" });
        expect(instance.size).toBe("large");
    });

    it("should set resourceValues.title with both resource and data title", () => {
        getComponentResourceValue.mockReturnValue("ResourceTitle");
        getComponentDataTitle.mockReturnValue("DataTitle");
        const instance = new CustomHeaderTextData({ title: "Header" });
        expect(instance.resourceValues.title).toBe("ResourceTitle DataTitle");
    });

    it("should set resourceValues.title with only resource title if data title is missing", () => {
        getComponentResourceValue.mockReturnValue("ResourceTitle");
        getComponentDataTitle.mockReturnValue("");
        const instance = new CustomHeaderTextData({ title: "Header" });
        expect(instance.resourceValues.title).toBe("ResourceTitle");
    });

    it("should set resourceValues.title with only data title if resource title is missing", () => {
        getComponentResourceValue.mockReturnValue("");
        getComponentDataTitle.mockReturnValue("DataTitle");
        const instance = new CustomHeaderTextData({ title: "Header" });
        expect(instance.resourceValues.title).toBe("DataTitle");
    });

    it("should set resourceValues.title as empty string if both resource and data title are missing", () => {
        getComponentResourceValue.mockReturnValue("");
        getComponentDataTitle.mockReturnValue("");
        const instance = new CustomHeaderTextData({ title: "Header" });
        expect(instance.resourceValues.title).toBe("");
    });

    it("should handle missing props gracefully", () => {
        getComponentResourceValue.mockReturnValue("");
        getComponentDataTitle.mockReturnValue("");
        const instance = new CustomHeaderTextData();
        expect(instance.size).toBeUndefined();
        expect(instance.resourceValues.title).toBe("");
    });
});
