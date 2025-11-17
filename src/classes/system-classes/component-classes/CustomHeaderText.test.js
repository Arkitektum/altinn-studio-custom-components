import CustomHeaderText from "./CustomHeaderText";
import CustomComponent from "../CustomComponent";
import * as helpers from "../../../functions/helpers";

describe("CustomHeaderText", () => {
    const mockGetComponentResourceValue = jest.spyOn(helpers, "getComponentResourceValue");

    beforeEach(() => {
        mockGetComponentResourceValue.mockClear();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomHeaderText({});
        expect(instance).toBeInstanceOf(CustomComponent);
    });

    it("should set size from props", () => {
        const instance = new CustomHeaderText({ size: "large" });
        expect(instance.size).toBe("large");
    });

    it("should set size as undefined if not provided", () => {
        const instance = new CustomHeaderText({});
        expect(instance.size).toBeUndefined();
    });

    it("should set resourceValues.title using getComponentResourceValue", () => {
        mockGetComponentResourceValue.mockReturnValue("Header Title");
        const props = { title: "header_title" };
        const instance = new CustomHeaderText(props);
        expect(mockGetComponentResourceValue).toHaveBeenCalledWith(props, "title");
        expect(instance.resourceValues.title).toBe("Header Title");
    });

    it("should handle missing title in props", () => {
        mockGetComponentResourceValue.mockReturnValue(undefined);
        const props = {};
        const instance = new CustomHeaderText(props);
        expect(instance.resourceValues.title).toBeUndefined();
    });
});
