import { getPart } from "./functions";
import Part from "../../../classes/data-classes/Part.js";
import { hasValue } from "../../../functions/helpers.js";

// Import the function to test

// Mock dependencies
jest.mock("../../../classes/data-classes/Part.js", () => {
    return jest.fn().mockImplementation((data) => ({ data }));
});
jest.mock("../../../functions/helpers.js", () => ({
    hasValue: jest.fn()
}));

// Import mocked dependencies

describe("getPart", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a Part instance when formData.data is valid", () => {
        const mockData = { key: "value" };
        const component = { formData: { data: mockData } };

        hasValue.mockReturnValue(true);

        const result = getPart(component);

        expect(hasValue).toHaveBeenCalledWith(mockData);
        expect(Part).toHaveBeenCalledWith(mockData);
        expect(result).toEqual({ data: mockData });
    });

    it("should return false when formData.data is invalid", () => {
        const component = { formData: { data: null } };

        hasValue.mockReturnValue(false);

        const result = getPart(component);

        expect(hasValue).toHaveBeenCalledWith(null);
        expect(Part).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it("should return false when formData is undefined", () => {
        const component = {};

        hasValue.mockReturnValue(false);

        const result = getPart(component);

        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(Part).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it("should return false when component is null", () => {
        const component = null;

        hasValue.mockReturnValue(false);

        const result = getPart(component);

        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(Part).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});
