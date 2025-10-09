import CustomListTiltaksFormaal from "./CustomListTiltaksFormaal";
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentResourceValue: jest.fn((props, key) => `resource_${key}`),
    hasValue: jest.fn((data) => {
        if (Array.isArray(data)) return data.length > 0;
        return !!data;
    })
}));

class CustomComponent {}

describe("CustomListTiltaksFormaal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true and resourceValues with emptyFieldText when data is empty", () => {
            const props = {
                formData: { data: [], simpleBinding: "" }
            };
            const instance = new CustomListTiltaksFormaal(props);
            expect(instance.isEmpty).toBe(true);
            expect(getComponentResourceValue).toHaveBeenCalledWith(props, "title");
            expect(getComponentResourceValue).toHaveBeenCalledWith(props, "emptyFieldText");
            expect(instance.resourceValues).toEqual({
                title: "resource_title",
                data: "resource_emptyFieldText"
            });
        });

        it("should set isEmpty to false and resourceValues with data when data is present", () => {
            const props = {
                formData: {
                    data: [{ kodebeskrivelse: "Test" }],
                    simpleBinding: ""
                }
            };
            const instance = new CustomListTiltaksFormaal(props);
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("resource_title");
            expect(instance.resourceValues.data).toEqual(["Test"]);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue and return its result", () => {
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            hasValue.mockReturnValueOnce(true);
            expect(instance.hasContent([1, 2])).toBe(true);
            hasValue.mockReturnValueOnce(false);
            expect(instance.hasContent([])).toBe(false);
        });
    });

    describe("getListItemsFromKey", () => {
        it('should return formatted list with "Annet" including simpleBinding', () => {
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            const formData = {
                data: [{ kodebeskrivelse: "Test" }, { kodebeskrivelse: "Annet" }],
                simpleBinding: "Other value"
            };
            expect(instance.getListItemsFromKey(formData)).toEqual(["Test", "Annet: Other value"]);
        });

        it("should return empty array if data is not an array", () => {
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            expect(instance.getListItemsFromKey({ data: null })).toEqual([]);
            expect(instance.getListItemsFromKey({})).toEqual([]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getListItemsFromKey", () => {
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            const props = {
                formData: {
                    data: [{ kodebeskrivelse: "Test" }],
                    simpleBinding: ""
                }
            };
            const spyDataValue = jest.spyOn(instance, "getComponentDataValue");
            const spyListItems = jest.spyOn(instance, "getListItemsFromKey");
            instance.getValueFromFormData(props);
            expect(spyDataValue).toHaveBeenCalledWith(props);
            expect(spyListItems).toHaveBeenCalled();
        });
    });

    describe("getComponentDataValue", () => {
        it("should return resourceValues.data if isChildComponent is true", () => {
            const props = {
                isChildComponent: true,
                resourceValues: { data: { foo: "bar" } }
            };
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            expect(instance.getComponentDataValue(props)).toEqual({ foo: "bar" });
        });

        it("should return formData simpleBinding and data if isChildComponent is false", () => {
            const props = {
                isChildComponent: false,
                formData: { simpleBinding: "sb", data: [1, 2] }
            };
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            expect(instance.getComponentDataValue(props)).toEqual({
                simpleBinding: "sb",
                data: [1, 2]
            });
        });

        it("should handle missing formData gracefully", () => {
            const props = {};
            const instance = new CustomListTiltaksFormaal({ formData: { data: [] } });
            expect(instance.getComponentDataValue(props)).toEqual({
                simpleBinding: undefined,
                data: undefined
            });
        });
    });
});
