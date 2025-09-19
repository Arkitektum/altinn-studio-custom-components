import CustomSummationArealdisponering from "./CustomSummationArealdisponering";

// Mocks for dependencies
jest.mock("../CustomComponent.js", () => {
    return jest.fn().mockImplementation(() => {});
});
jest.mock("../../data-classes/Arealdisponering.js", () => {
    return jest.fn().mockImplementation((data) => ({ ...data, bebyggelsen: data.bebyggelsen, tomtearealet: data.tomtearealet }));
});
jest.mock("../data-classes/ArealdisponeringSummation.js", () => {
    return jest.fn().mockImplementation((arealdisponering, resourceBindings) => ({
        ...arealdisponering,
        resourceBindings,
        bebyggelsen: arealdisponering.bebyggelsen,
        tomtearealet: arealdisponering.tomtearealet
    }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomSummationArealdisponering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is present", () => {
            const props = { resourceBindings: {} };
            const fakeData = {
                bebyggelsen: { resourceValues: { data: 1 } },
                tomtearealet: { resourceValues: { data: 2 } }
            };

            getComponentDataValue.mockReturnValue(fakeData);
            hasValue.mockImplementation((val) => !!val);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomSummationArealdisponering(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toBe(false);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.data).toBeInstanceOf(Object);
        });

        it("should set isEmpty true and resourceValues.data to emptyFieldText when data is empty", () => {
            const props = { resourceBindings: { emptyFieldText: "empty" } };
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("empty text");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomSummationArealdisponering(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("empty text");
        });
    });

    describe("getValueFromFormData", () => {
        it("should return undefined if hasValue returns false", () => {
            const instance = new CustomSummationArealdisponering({});
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue(undefined);

            const result = instance.getValueFromFormData({}, {});
            expect(result).toBeUndefined();
        });

        it("should return ArealdisponeringSummation if hasArealdisponeringSummationProps returns true", () => {
            const instance = new CustomSummationArealdisponering({});
            hasValue.mockReturnValue(true);
            getComponentDataValue.mockReturnValue({ bebyggelsen: { resourceValues: { data: 1 } } });
            jest.spyOn(instance, "hasArealdisponeringSummationProps").mockReturnValue(true);

            const result = instance.getValueFromFormData({}, {});
            expect(result).toBeDefined();
            expect(instance.hasArealdisponeringSummationProps).toHaveBeenCalled();
        });

        it("should return undefined if hasArealdisponeringSummationProps returns false", () => {
            const instance = new CustomSummationArealdisponering({});
            hasValue.mockReturnValue(true);
            getComponentDataValue.mockReturnValue({ bebyggelsen: { resourceValues: { data: 1 } } });
            jest.spyOn(instance, "hasArealdisponeringSummationProps").mockReturnValue(false);

            const result = instance.getValueFromFormData({}, {});
            expect(result).toBeUndefined();
        });
    });

    describe("hasArealdisponeringSummationProps", () => {
        it("should return true if hasBebyggelsenData returns true", () => {
            const instance = new CustomSummationArealdisponering({});
            jest.spyOn(instance, "hasBebyggelsenData").mockReturnValue(true);
            jest.spyOn(instance, "hasTomtearealetData").mockReturnValue(false);

            expect(instance.hasArealdisponeringSummationProps({})).toBe(true);
        });

        it("should return true if hasTomtearealetData returns true", () => {
            const instance = new CustomSummationArealdisponering({});
            jest.spyOn(instance, "hasBebyggelsenData").mockReturnValue(false);
            jest.spyOn(instance, "hasTomtearealetData").mockReturnValue(true);

            expect(instance.hasArealdisponeringSummationProps({})).toBe(true);
        });

        it("should return false if both hasBebyggelsenData and hasTomtearealetData return false", () => {
            const instance = new CustomSummationArealdisponering({});
            jest.spyOn(instance, "hasBebyggelsenData").mockReturnValue(false);
            jest.spyOn(instance, "hasTomtearealetData").mockReturnValue(false);

            expect(instance.hasArealdisponeringSummationProps({})).toBe(false);
        });
    });

    describe("hasBebyggelsenData", () => {
        it("should return true if bebyggelsen.resourceValues.data has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomSummationArealdisponering({});
            const obj = { bebyggelsen: { resourceValues: { data: 123 } } };
            expect(instance.hasBebyggelsenData(obj)).toBe(true);
        });

        it("should return false if bebyggelsen.resourceValues.data does not have value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomSummationArealdisponering({});
            const obj = { bebyggelsen: { resourceValues: { data: null } } };
            expect(instance.hasBebyggelsenData(obj)).toBe(false);
        });
    });

    describe("hasTomtearealetData", () => {
        it("should return true if tomtearealet.resourceValues.data has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomSummationArealdisponering({});
            const obj = { tomtearealet: { resourceValues: { data: 456 } } };
            expect(instance.hasTomtearealetData(obj)).toBe(true);
        });

        it("should return false if tomtearealet.resourceValues.data does not have value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomSummationArealdisponering({});
            const obj = { tomtearealet: { resourceValues: { data: null } } };
            expect(instance.hasTomtearealetData(obj)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources if window is defined", () => {
            // Set window.textResources before creating the instance
            global.window = { textResources: ["a", "b"] };
            hasMissingTextResources.mockReturnValue(true);
            const instance = new CustomSummationArealdisponering({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(result).toBe(true);
            delete global.window;
        });

        it("should call hasMissingTextResources with empty array if window is undefined", () => {
            hasMissingTextResources.mockReturnValue(false);
            const instance = new CustomSummationArealdisponering({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith([], { foo: "bar" });
            expect(result).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomSummationArealdisponering({});
            expect(instance.hasContent("something")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomSummationArealdisponering({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getTextResourceBindings", () => {
        it("should return default resource bindings if no props are provided", () => {
            const instance = new CustomSummationArealdisponering({});
            const result = instance.getTextResourceBindings({});
            expect(result.tomtearealet.title).toBe("resource.rammebetingelser.arealdisponering.tomtearealet.title");
            expect(result.bebyggelsen.title).toBe("resource.rammebetingelser.arealdisponering.bebyggelsen.title");
            expect(result.arealdisponering.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should override resource bindings with props.resourceBindings", () => {
            const props = {
                resourceBindings: {
                    tomtearealet: { title: "custom.tomtearealet" },
                    emptyFieldText: "custom.empty"
                }
            };
            const instance = new CustomSummationArealdisponering(props);
            const result = instance.getTextResourceBindings(props);
            expect(result.tomtearealet.title).toBe("custom.tomtearealet");
            expect(result.arealdisponering.emptyFieldText).toBe("custom.empty");
        });

        it("should not include part if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true, resourceBindings: {} };
            const instance = new CustomSummationArealdisponering(props);
            const result = instance.getTextResourceBindings(props);
            expect(result.part).toBeUndefined();
        });

        it('should not include part if hideIfEmpty is "true"', () => {
            const props = { hideIfEmpty: "true", resourceBindings: {} };
            const instance = new CustomSummationArealdisponering(props);
            const result = instance.getTextResourceBindings(props);
            expect(result.part).toBeUndefined();
        });
    });
});
