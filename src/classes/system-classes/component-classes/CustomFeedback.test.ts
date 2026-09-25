import type { ComponentProps } from "../../../types.ts";

import CustomFeedback from "./CustomFeedback.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mock dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with data from getComponentDataValue and set isEmpty correctly when data has value", () => {
        const props = { some: "prop" } as unknown as ComponentProps;
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("feedback");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);

        const feedback = new CustomFeedback(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(hasValue).toHaveBeenCalledWith("feedback");
        expect(feedback.isEmpty).toBe(false);
        expect(feedback.resourceValues).toEqual({ data: "feedback" });
    });

    it("should set isEmpty to true when data does not have value", () => {
        const props = { some: "prop" } as unknown as ComponentProps;
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("");
        (hasValue as unknown as jest.Mock).mockReturnValue(false);

        const feedback = new CustomFeedback(props);

        expect(feedback.isEmpty).toBe(true);
        expect(feedback.resourceValues).toEqual({ data: "" });
    });

    it("hasContent should delegate to hasValue", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const feedback = new CustomFeedback({});
        expect(feedback.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("xyz");
        const feedback = new CustomFeedback({});
        expect(feedback.getValueFromFormData({ foo: "bar" } as unknown as ComponentProps)).toBe("xyz");
        expect(getComponentDataValue).toHaveBeenCalledWith({ foo: "bar" } as unknown as ComponentProps);
    });
});
