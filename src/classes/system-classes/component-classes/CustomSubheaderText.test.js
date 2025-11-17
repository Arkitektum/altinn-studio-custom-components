import CustomSubHeaderText from "./CustomSubheaderText";
import * as helpers from "../../../functions/helpers";
import CustomComponent from "../CustomComponent";

describe("CustomSubHeaderText", () => {
    const mockProps = { title: "Test Title", otherProp: "value" };

    beforeEach(() => {
        jest.spyOn(helpers, "getComponentResourceValue").mockImplementation((props, key) => {
            return props[key] ? `resource:${props[key]}` : undefined;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomSubHeaderText(mockProps);
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should initialize resourceValues with title from getComponentResourceValue", () => {
        const instance = new CustomSubHeaderText(mockProps);
        expect(helpers.getComponentResourceValue).toHaveBeenCalledWith(mockProps, "title");
        expect(instance.resourceValues).toEqual({ title: "resource:Test Title" });
    });

    it("should set title to undefined if not present in props", () => {
        const propsWithoutTitle = { otherProp: "value" };
        const instance = new CustomSubHeaderText(propsWithoutTitle);
        expect(instance.resourceValues).toEqual({ title: undefined });
    });
});
