import type { ComponentProps } from "../../../types.ts";

import CustomFeedbackData from "./CustomFeedbackData.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomFeedbackData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data has no content", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(null);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);

        const props = { some: "prop" } as unknown as ComponentProps;
        const instance = new CustomFeedbackData(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(hasValue).toHaveBeenCalledWith(null);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues).toEqual({ data: null });
    });

    it("should set isEmpty to false if data has content", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("feedback");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);

        const props = { some: "prop" } as unknown as ComponentProps;
        const instance = new CustomFeedbackData(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(hasValue).toHaveBeenCalledWith("feedback");
        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues).toEqual({ data: "feedback" });
    });

    it("hasContent should delegate to hasValue", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const instance = new CustomFeedbackData({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("xyz");
        const instance = new CustomFeedbackData({});
        expect(instance.getValueFromFormData({ foo: "bar" } as unknown as ComponentProps)).toBe("xyz");
        expect(getComponentDataValue).toHaveBeenCalledWith({ foo: "bar" } as unknown as ComponentProps);
    });
});
