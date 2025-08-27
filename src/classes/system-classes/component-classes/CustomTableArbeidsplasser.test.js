import CustomTableArbeidsplasser from "./CustomTableArbeidsplasser";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Arbeidsplasser.js", () => {
    return function Arbeidsplasser(data) {
        return { ...data };
    };
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

describe("CustomTableArbeidsplasser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true if no content", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const props = { resourceBindings: { emptyFieldText: "emptyTextKey" } };
            const instance = new CustomTableArbeidsplasser(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
        });

        it("should set isEmpty to false if there is content", () => {
            getComponentDataValue.mockReturnValue({ eksisterende: true });
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockImplementation((key) => key);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const props = { resourceBindings: {} };
            const instance = new CustomTableArbeidsplasser(props);

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
        });

        it("should set validationMessages and hasValidationMessages", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");
            hasMissingTextResources.mockReturnValue(true);
            hasValidationMessages.mockReturnValue(true);

            const props = { resourceBindings: { emptyFieldText: "emptyTextKey" } };
            const instance = new CustomTableArbeidsplasser(props);

            expect(instance.validationMessages).toBe(true);
            expect(instance.hasValidationMessages).toBe(true);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return undefined if no value", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);

            const instance = new CustomTableArbeidsplasser({});
            const result = instance.getValueFromFormData({}, ["eksisterende"], {});
            expect(result).toBeUndefined();
        });

        it("should return array if arbeidsplasserBeroertProps exist", () => {
            getComponentDataValue.mockReturnValue({ eksisterende: true });
            hasValue.mockReturnValue(true);

            const instance = new CustomTableArbeidsplasser({});
            jest.spyOn(instance, "hasArbeidsplasserBeroertProps").mockReturnValue(true);
            jest.spyOn(instance, "getArbeidsplasserBeroertArray").mockReturnValue([{ title: "t", value: "v" }]);

            const result = instance.getValueFromFormData({}, ["eksisterende"], {});
            expect(result).toEqual([{ title: "t", value: "v" }]);
        });

        it("should return undefined if arbeidsplasserBeroertProps do not exist", () => {
            getComponentDataValue.mockReturnValue({ eksisterende: true });
            hasValue.mockReturnValue(true);

            const instance = new CustomTableArbeidsplasser({});
            jest.spyOn(instance, "hasArbeidsplasserBeroertProps").mockReturnValue(false);

            const result = instance.getValueFromFormData({}, ["eksisterende"], {});
            expect(result).toBeUndefined();
        });
    });

    describe("getArbeidsplasserBeroertArray", () => {
        it("should map keys to title and value", () => {
            getTextResourceFromResourceBinding.mockImplementation((key) => key);

            const instance = new CustomTableArbeidsplasser({});
            const arbeidsplasser = { eksisterende: true, faste: false };
            const keys = ["eksisterende", "faste"];
            const resourceBindings = {
                eksisterende: { title: "eksTitle", trueText: "eksTrue", falseText: "eksFalse" },
                faste: { title: "fasteTitle", trueText: "fasteTrue", falseText: "fasteFalse" }
            };

            const result = instance.getArbeidsplasserBeroertArray(arbeidsplasser, keys, resourceBindings);
            expect(result).toEqual([
                { title: "eksTitle", value: "eksTrue" },
                { title: "fasteTitle", value: "fasteFalse" }
            ]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            global.window = { textResources: ["foo"] };
            hasMissingTextResources.mockReturnValue(true);
            const instance = new CustomTableArbeidsplasser({});
            expect(instance.getValidationMessages({})).toBe(true);
            delete global.window;
        });

        it("should call hasMissingTextResources with empty array if window is undefined", () => {
            delete global.window;
            hasMissingTextResources.mockReturnValue(false);

            const instance = new CustomTableArbeidsplasser({});
            const result = instance.getValidationMessages({ key: "val" });
            expect(hasMissingTextResources).toHaveBeenCalledWith([], { key: "val" });
            expect(result).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableArbeidsplasser({});
            expect(instance.hasContent({})).toBe(true);

            hasValue.mockReturnValue(false);
            expect(instance.hasContent({})).toBe(false);
        });
    });

    describe("hasArbeidsplasserBeroertProps", () => {
        it("should return true if any key exists", () => {
            const instance = new CustomTableArbeidsplasser({});
            const arbeidsplasser = { eksisterende: true, faste: undefined };
            const keys = ["eksisterende", "faste"];
            expect(instance.hasArbeidsplasserBeroertProps(arbeidsplasser, keys)).toBe(true);
        });

        it("should return false if no key exists", () => {
            const instance = new CustomTableArbeidsplasser({});
            const arbeidsplasser = { eksisterende: undefined, faste: undefined };
            const keys = ["eksisterende", "faste"];
            expect(instance.hasArbeidsplasserBeroertProps(arbeidsplasser, keys)).toBe(false);
        });
    });

    describe("getTextResourceBindings", () => {
        it("should generate resource bindings with defaults", () => {
            const instance = new CustomTableArbeidsplasser({});
            const props = { resourceBindings: {} };
            const keys = ["eksisterende", "faste"];
            const result = instance.getTextResourceBindings(props, keys);

            expect(result.arbeidsplasserKey.title).toBe("resource.arbeidsplasser.arbeidsplasserKey.title");
            expect(result.beroertAvTiltaket.title).toBe("resource.arbeidsplasser.beroertAvTiltaket.title");
            expect(result.eksisterende.title).toBe("resource.arbeidsplasser.eksisterende.title");
            expect(result.eksisterende.trueText).toBe("resource.trueText.default");
            expect(result.eksisterende.falseText).toBe("resource.falseText.default");
            expect(result.arbeidsplasser.title).toBe("resource.arbeidsplasser.title");
            expect(result.arbeidsplasser.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should respect hideTitle and hideIfEmpty", () => {
            const instance = new CustomTableArbeidsplasser({});
            const props = { resourceBindings: {}, hideTitle: true, hideIfEmpty: true };
            const keys = ["eksisterende"];
            const result = instance.getTextResourceBindings(props, keys);

            expect(result.arbeidsplasser.title).toBeUndefined();
            expect(result.arbeidsplasser.emptyFieldText).toBeUndefined();
        });

        it("should use provided resourceBindings", () => {
            const instance = new CustomTableArbeidsplasser({});
            const props = {
                resourceBindings: {
                    eksisterende: { title: "customTitle", trueText: "yes", falseText: "no" },
                    title: "mainTitle",
                    emptyFieldText: "emptyText"
                }
            };
            const keys = ["eksisterende"];
            const result = instance.getTextResourceBindings(props, keys);

            expect(result.eksisterende.title).toBe("customTitle");
            expect(result.eksisterende.trueText).toBe("yes");
            expect(result.eksisterende.falseText).toBe("no");
            expect(result.arbeidsplasser.title).toBe("mainTitle");
            expect(result.arbeidsplasser.emptyFieldText).toBe("emptyText");
        });
    });
});
