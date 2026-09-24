import { getComponentDataValue, getComponentResourceValue, isNumberLargerThanZero } from "../../../functions/helpers.ts";
import CustomFieldCountData from "./CustomFieldCountData.ts";

// Mock dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    isNumberLargerThanZero: jest.fn()
}));

describe("CustomFieldCountData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true when data is empty", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
        (isNumberLargerThanZero as unknown as jest.Mock).mockReturnValue(false);
        (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => `resource_${key}`);

        const props = { formData: {}, hideTitle: false };
        const instance = new CustomFieldCountData(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("resource_emptyFieldText");
        expect(instance.resourceValues.title).toBe("resource_title");
    });

    it("should set isEmpty to false when data length > 0", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([1, 2, 3]);
        (isNumberLargerThanZero as unknown as jest.Mock).mockReturnValue(true);
        (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => `resource_${key}`);

        const props = { formData: {}, hideTitle: false };
        const instance = new CustomFieldCountData(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe(3);
        expect(instance.resourceValues.title).toBe("resource_title");
    });

    it("should hide title when hideTitle is true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([1]);
        (isNumberLargerThanZero as unknown as jest.Mock).mockReturnValue(true);
        (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => `resource_${key}`);

        const props = { formData: {}, hideTitle: true };
        const instance = new CustomFieldCountData(props);

        expect(instance.resourceValues.title).toBe(false);
    });

    it("hasContent returns result of isNumberLargerThanZero", () => {
        (isNumberLargerThanZero as unknown as jest.Mock).mockReturnValue(true);
        const instance = new CustomFieldCountData({ formData: {} });
        expect(instance.hasContent(5)).toBe(true);

        (isNumberLargerThanZero as unknown as jest.Mock).mockReturnValue(false);
        expect(instance.hasContent(0)).toBe(false);
    });

    it("getValueFromFormData returns length of array", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([1, 2]);
        const instance = new CustomFieldCountData({ formData: {} });
        expect(instance.getValueFromFormData({ formData: {} })).toBe(2);
    });

    it("getValueFromFormData returns 0 if not array", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(null);
        const instance = new CustomFieldCountData({ formData: {} });
        expect(instance.getValueFromFormData({ formData: {} })).toBe(0);

        (getComponentDataValue as unknown as jest.Mock).mockReturnValue({});
        expect(instance.getValueFromFormData({ formData: {} })).toBe(0);
    });
});
