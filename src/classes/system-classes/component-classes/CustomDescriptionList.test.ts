import CustomDescriptionList from "./CustomDescriptionList.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mock the hasValue function
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomDescriptionList.hasContent", () => {
    let instance: CustomDescriptionList;

    beforeEach(() => {
        instance = new CustomDescriptionList({});
        jest.clearAllMocks();
    });

    it("should return true when hasValue returns true for resourceValues.data", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const props = { resourceValues: { data: "some data" } };
        expect(instance.hasContent(props)).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("some data");
    });

    it("should return false when hasValue returns false for resourceValues.data", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { resourceValues: { data: null } };
        expect(instance.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(null);
    });

    it("should handle missing resourceValues gracefully", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = {};
        expect(instance.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("should handle missing props gracefully", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        expect(instance.hasContent(undefined)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("should handle resourceValues present but data missing", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { resourceValues: {} };
        expect(instance.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });
});
