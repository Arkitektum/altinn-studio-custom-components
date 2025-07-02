import { getFormDataValue } from "./functions";
import { hasValue, getEmptyFieldText } from "../../../functions/helpers.js";

// Mock the helper functions
jest.mock("../../../functions/helpers.js", () => ({
    hasValue: jest.fn(),
    getEmptyFieldText: jest.fn()
}));

describe("getFormDataValue", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns simpleBinding value when hasValue returns true", () => {
        hasValue.mockReturnValue(true);
        const component = { formData: { simpleBinding: true } };
        const result = getFormDataValue(component);
        expect(result).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(true);
        expect(getEmptyFieldText).not.toHaveBeenCalled();
    });

    it("returns getEmptyFieldText result when hasValue returns false", () => {
        hasValue.mockReturnValue(false);
        getEmptyFieldText.mockReturnValue("empty");
        const component = { formData: { simpleBinding: null } };
        const result = getFormDataValue(component);
        expect(result).toBe("empty");
        expect(hasValue).toHaveBeenCalledWith(null);
        expect(getEmptyFieldText).toHaveBeenCalledWith(component);
    });

    it("handles missing formData gracefully", () => {
        hasValue.mockReturnValue(false);
        getEmptyFieldText.mockReturnValue("empty");
        const component = {};
        const result = getFormDataValue(component);
        expect(result).toBe("empty");
        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(getEmptyFieldText).toHaveBeenCalledWith(component);
    });

    it("handles missing component gracefully", () => {
        hasValue.mockReturnValue(false);
        getEmptyFieldText.mockReturnValue("empty");
        const result = getFormDataValue(undefined);
        expect(result).toBe("empty");
        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(getEmptyFieldText).toHaveBeenCalledWith(undefined);
    });
});
