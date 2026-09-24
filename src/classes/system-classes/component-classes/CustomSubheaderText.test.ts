import type { ComponentProps } from "../../../types.ts";

import * as helpers from "../../../functions/helpers.ts";
import CustomComponent from "../CustomComponent.ts";
import CustomSubheaderText from "./CustomSubheaderText.ts";

describe("CustomSubheaderText", () => {
    const mockProps = { title: "Test Title", otherProp: "value" };

    beforeEach(() => {
        jest.spyOn(helpers, "getComponentResourceValue").mockImplementation((props, key) => {
            const values = props as unknown as Record<string, unknown>;
            return values[key] ? `resource:${values[key]}` : undefined;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomSubheaderText(mockProps as unknown as ComponentProps);
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should initialize resourceValues with title from getComponentResourceValue", () => {
        const instance = new CustomSubheaderText(mockProps as unknown as ComponentProps);
        expect(helpers.getComponentResourceValue).toHaveBeenCalledWith(mockProps as unknown as ComponentProps, "title");
        expect(instance.resourceValues).toEqual({ title: "resource:Test Title" });
    });

    it("should set title to undefined if not present in props", () => {
        const propsWithoutTitle = { otherProp: "value" };
        const instance = new CustomSubheaderText(propsWithoutTitle as unknown as ComponentProps);
        expect(instance.resourceValues).toEqual({ title: undefined });
    });
});
