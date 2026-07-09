import CustomMatrix from "./CustomMatrix";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mock CustomComponent since it's a superclass
jest.mock("../CustomComponent.js", () => {
    return class {};
});

// Mock hasValue helper
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomMatrix", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to false and keep resourceValues when resourceValues.data has value", () => {
        hasValue.mockReturnValue(true);
        const props = {
            resourceValues: {
                data: [
                    [1, 2],
                    [3, 4]
                ]
            }
        };

        const matrix = new CustomMatrix(props);

        expect(matrix.isEmpty).toBe(false);
        expect(matrix.resourceValues).toEqual(props.resourceValues);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });

    it("should set isEmpty to true when resourceValues.data is empty", () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { data: [] } };

        const matrix = new CustomMatrix(props);

        expect(matrix.isEmpty).toBe(true);
        expect(matrix.resourceValues).toEqual(props.resourceValues);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });

    it("should set isEmpty to true and default resourceValues to an empty object when props is undefined", () => {
        hasValue.mockReturnValue(false);

        const matrix = new CustomMatrix();

        expect(matrix.isEmpty).toBe(true);
        expect(matrix.resourceValues).toEqual({});
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("hasContent should return true if hasValue returns true", () => {
        hasValue.mockReturnValue(true);
        const props = { resourceValues: { data: ["row"] } };
        const matrix = new CustomMatrix({});

        expect(matrix.hasContent(props)).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });

    it("hasContent should return false if hasValue returns false", () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { data: null } };
        const matrix = new CustomMatrix({});

        expect(matrix.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });
});
