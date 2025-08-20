import CustomGrouplistUtfallSvar from "./CustomGrouplistUtfallSvar";
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for dependencies
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGrouplistUtfallSvar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true when data has no value", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.title).toBe("text:titleKey");
        expect(instance.resourceValues.data).toBe("text:emptyFieldKey");
    });

    it("should set isEmpty to false when data has value", () => {
        getComponentDataValue.mockReturnValue("someData");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("someData");
    });

    it("should hide title if hideTitle is true", () => {
        getComponentDataValue.mockReturnValue("someData");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            },
            hideTitle: true
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.resourceValues.title).toBe("text:undefined");
    });

    it("should use default emptyFieldText if not provided and hideIfEmpty is not true", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.resourceValues.data).toBe("text:resource.emptyFieldText.default");
    });

    it("should not set emptyFieldText if hideIfEmpty is true", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            },
            hideIfEmpty: true
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.resourceValues.data).toBe("text:undefined");
    });

    it("should call hasValidationMessages and set validationMessages", () => {
        getComponentDataValue.mockReturnValue("someData");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue(["missingKey"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.validationMessages).toEqual(["missingKey"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGrouplistUtfallSvar({});
            expect(instance.hasContent("data")).toBe(true);

            hasValue.mockReturnValue(false);
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            getTextResources.mockReturnValue(["resource1"]);
            hasMissingTextResources.mockReturnValue(["missing"]);
            const instance = new CustomGrouplistUtfallSvar({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(getTextResources).toHaveBeenCalled();
            expect(hasMissingTextResources).toHaveBeenCalledWith(["resource1"], { foo: "bar" });
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue with props", () => {
            getComponentDataValue.mockReturnValue("value");
            const instance = new CustomGrouplistUtfallSvar({});
            const result = instance.getValueFromFormData({ foo: "bar" });
            expect(getComponentDataValue).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toBe("value");
        });
    });

    describe("getResourceBindings", () => {
        it("should include title and emptyFieldText when not hidden", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyFieldKey"
                }
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar.title).toBe("titleKey");
            expect(result.utfallSvar.emptyFieldText).toBe("emptyFieldKey");
        });

        it("should not include title when hideTitle is true", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {
                    title: "titleKey"
                },
                hideTitle: true
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar.title).toBeUndefined();
        });

        it("should use default emptyFieldText when not provided", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {}
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should not include emptyFieldText when hideIfEmpty is true", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {
                    emptyFieldText: "emptyFieldKey"
                },
                hideIfEmpty: true
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar.emptyFieldText).toBeUndefined();
        });
    });
});
