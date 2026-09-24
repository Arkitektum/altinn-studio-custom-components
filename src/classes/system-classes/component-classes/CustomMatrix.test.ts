import type { ComponentProps } from "../../../types.ts";

import CustomMatrix from "./CustomMatrix.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mock CustomComponent since it's a superclass
jest.mock("../CustomComponent.ts", () => {
    const { hasValue } = require("@arkitektum/altinn-studio-custom-components-utils");
    const { hasMissingTextResources } = require("../../../functions/validations.ts");
    return class {
        hasContent(data: unknown) {
            return hasValue(data);
        }
        getValidationMessages(resourceBindings: unknown) {
            return hasMissingTextResources(resourceBindings);
        }
    };
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
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
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
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { resourceValues: { data: [] } };

        const matrix = new CustomMatrix(props);

        expect(matrix.isEmpty).toBe(true);
        expect(matrix.resourceValues).toEqual(props.resourceValues);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });

    it("should set isEmpty to true and default resourceValues to an empty object when props is undefined", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);

        const matrix = new CustomMatrix(undefined as unknown as ComponentProps);

        expect(matrix.isEmpty).toBe(true);
        expect(matrix.resourceValues).toEqual({});
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("hasContent should return true if hasValue returns true", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const props = { resourceValues: { data: ["row"] } };
        const matrix = new CustomMatrix({});

        expect(matrix.hasContent(props)).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });

    it("hasContent should return false if hasValue returns false", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { resourceValues: { data: null } };
        const matrix = new CustomMatrix({});

        expect(matrix.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(props.resourceValues.data);
    });
});
