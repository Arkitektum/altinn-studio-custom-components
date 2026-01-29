import CustomGroupSamsvarErklaeringer from "./CustomGroupSamsvarErklaeringer";
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

// Mocks for dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(() => [{ id: 1 }, { id: 2 }]),
    getTextResourceFromResourceBinding: jest.fn((key) => `text-for-${key}`),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => []),
    hasValidationMessages: jest.fn((msgs) => Array.isArray(msgs) && msgs.length > 0)
}));
jest.mock(
    "../../data-classes/SamsvarAnsvarsomraade.js",
    () =>
        function SamsvarAnsvarsomraade(data, resourceBindings) {
            this.data = data;
            this.resourceBindings = resourceBindings;
        }
);

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");

describe("CustomGroupSamsvarErklaeringer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should initialize properties correctly when data is present", () => {
            const props = {
                resourceBindings: {},
                resourceValues: {}
            };
            const instance = new CustomGroupSamsvarErklaeringer(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toEqual([]);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.title).toBeUndefined();
            expect(instance.resourceValues.data).toBeInstanceOf(Array);
        });

        it("should set isEmpty true and data to emptyFieldText when no data", () => {
            getComponentDataValue.mockReturnValueOnce(undefined);
            hasValue.mockReturnValueOnce(false);

            const props = {
                resourceBindings: {},
                resourceValues: {}
            };
            const instance = new CustomGroupSamsvarErklaeringer(props);

            expect(instance.isEmpty).toBe(true);
            expect(getTextResourceFromResourceBinding).toHaveBeenCalled();
            expect(typeof instance.resourceValues.data).toBe("string");
        });

        it("should set resourceValues.title if provided in props", () => {
            const props = {
                resourceBindings: {},
                resourceValues: { title: "My Title" }
            };
            const instance = new CustomGroupSamsvarErklaeringer(props);

            expect(instance.resourceValues.title).toBe("My Title");
        });
    });

    describe("getResourceBindings", () => {
        it("should set default resource bindings", () => {
            const props = {};
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.samsvarErklaeringTekst.title).toBe("resource.samsvarErklaeringTekst.title");
            expect(bindings.samsvarPROTekst.title).toBe("resource.samsvarPROTekst.title");
            expect(bindings.samsvarUTFTekst.title).toBe("resource.samsvarUTFTekst.title");
            expect(bindings.erklaeringer.title).toBe("resource.erklaeringer.title");
            expect(bindings.erklaeringer.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use overrides from props.resourceBindings", () => {
            const props = {
                resourceBindings: {
                    samsvarErklaeringTekst: { title: "custom1", emptyFieldText: "empty1" },
                    samsvarPROTekst: { title: "custom2", emptyFieldText: "empty2" },
                    samsvarUTFTekst: { title: "custom3", emptyFieldText: "empty3" },
                    title: "customTitle",
                    emptyFieldText: "customEmpty"
                }
            };
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.samsvarErklaeringTekst.title).toBe("custom1");
            expect(bindings.samsvarErklaeringTekst.emptyFieldText).toBe("empty1");
            expect(bindings.samsvarPROTekst.title).toBe("custom2");
            expect(bindings.samsvarPROTekst.emptyFieldText).toBe("empty2");
            expect(bindings.samsvarUTFTekst.title).toBe("custom3");
            expect(bindings.samsvarUTFTekst.emptyFieldText).toBe("empty3");
            expect(bindings.erklaeringer.title).toBe("customTitle");
            expect(bindings.erklaeringer.emptyFieldText).toBe("customEmpty");
        });

        it("should not set erklaeringer.title if hideTitle is true", () => {
            const props = { hideTitle: true, resourceBindings: {} };
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.erklaeringer?.title).toBeUndefined();
        });

        it('should not set erklaeringer.title if hideTitle is "true"', () => {
            const props = { hideTitle: "true", resourceBindings: {} };
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.erklaeringer?.title).toBeUndefined();
        });

        it("should not set erklaeringer.title if resourceValues.title is present", () => {
            const props = { resourceValues: { title: "present" }, resourceBindings: {} };
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.erklaeringer?.title).toBeUndefined();
        });

        it("should not set erklaeringer.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true, resourceBindings: {} };
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.erklaeringer?.emptyFieldText).toBeUndefined();
        });

        it('should not set erklaeringer.emptyFieldText if hideIfEmpty is "true"', () => {
            const props = { hideIfEmpty: "true", resourceBindings: {} };
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const bindings = instance.getResourceBindings(props);

            expect(bindings.erklaeringer?.emptyFieldText).toBeUndefined();
        });
    });

    describe("getValueFromFormData", () => {
        it("should return ansvarsomraade list from data", () => {
            const props = {};
            const instance = new CustomGroupSamsvarErklaeringer(props);
            const resourceBindings = {};
            const result = instance.getValueFromFormData(props, resourceBindings);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data");
            expect(result[0]).toHaveProperty("resourceBindings");
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return undefined if data is not present", () => {
            hasValue.mockReturnValueOnce(false);
            const instance = new CustomGroupSamsvarErklaeringer({});
            const result = instance.getAnsvarsomraadeListFromData(undefined, {});
            expect(result).toBeUndefined();
        });

        it("should return mapped SamsvarAnsvarsomraade array if data is array", () => {
            hasValue.mockReturnValueOnce(true);
            const instance = new CustomGroupSamsvarErklaeringer({});
            const data = [{ id: 1 }, { id: 2 }];
            const result = instance.getAnsvarsomraadeListFromData(data, {});

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty("data");
        });

        it("should return empty array if data is not array", () => {
            hasValue.mockReturnValueOnce(true);
            const instance = new CustomGroupSamsvarErklaeringer({});
            const result = instance.getAnsvarsomraadeListFromData("notArray", {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources", () => {
            const instance = new CustomGroupSamsvarErklaeringer({});
            const bindings = {};
            instance.getValidationMessages(bindings);
            expect(hasMissingTextResources).toHaveBeenCalledWith(bindings);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            const instance = new CustomGroupSamsvarErklaeringer({});
            instance.hasContent("abc");
            expect(hasValue).toHaveBeenCalledWith("abc");
        });
    });
});
