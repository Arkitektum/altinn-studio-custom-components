import CustomGrouplistNaboGjenboerEiendom from "./CustomGrouplistNaboGjenboerEiendom";
import NaboGjenboerEiendom from "../../data-classes/NaboGjenboerEiendom";
const { getComponentDataValue } = require("../../../functions/helpers");

// Mock the global function getComponentDataValue
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomGrouplistNaboGjenboerEiendom.getValueFromFormData", () => {
    let instance;

    beforeEach(() => {
        instance = new CustomGrouplistNaboGjenboerEiendom({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return an array of NaboGjenboerEiendom instances when data is present", () => {
        const mockData = [
            { id: 1, name: "Eiendom 1" },
            { id: 2, name: "Eiendom 2" }
        ];
        getComponentDataValue.mockReturnValue(mockData);

        const result = instance.getValueFromFormData({});

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(NaboGjenboerEiendom);
        expect(result[0]).toMatchObject(new NaboGjenboerEiendom(mockData[0]));
        expect(result[1]).toBeInstanceOf(NaboGjenboerEiendom);
        expect(result[1]).toMatchObject(new NaboGjenboerEiendom(mockData[1]));
    });

    it("should return undefined if data is undefined", () => {
        getComponentDataValue.mockReturnValue(undefined);

        const result = instance.getValueFromFormData({});

        expect(result).toBeUndefined();
    });

    it("should return an empty array if data is an empty array", () => {
        getComponentDataValue.mockReturnValue([]);

        const result = instance.getValueFromFormData({});

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });

    it("should handle null data gracefully", () => {
        getComponentDataValue.mockReturnValue(null);

        const result = instance.getValueFromFormData({});

        expect(result).toBeUndefined();
    });
});
