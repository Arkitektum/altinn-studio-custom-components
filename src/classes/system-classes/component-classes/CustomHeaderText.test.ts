import type { ComponentProps } from "../../../types.ts";

import * as helpers from "../../../functions/helpers.ts";
import CustomComponent from "../CustomComponent.ts";
import CustomHeaderText from "./CustomHeaderText.ts";

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
        const instance = new CustomHeaderText(props as unknown as ComponentProps);
        expect(mockGetComponentResourceValue).toHaveBeenCalledWith(props as unknown as ComponentProps, "title");
        expect(instance.resourceValues.title).toBe("Header Title");
    });

    it("should handle missing title in props", () => {
        mockGetComponentResourceValue.mockReturnValue(undefined);
        const props = {};
        const instance = new CustomHeaderText(props);
        expect(instance.resourceValues.title).toBeUndefined();
    });
});
