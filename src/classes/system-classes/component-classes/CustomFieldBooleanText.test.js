import CustomFieldBooleanText from "./CustomFieldBooleanText";
import CustomComponent from "../CustomComponent";

// Mock helper functions
jest.mock("../../../functions/helpers.js", () => ({
    getComponentBooleanTextValues: jest.fn(),
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));

const {
    getComponentBooleanTextValues,
    getComponentDataValue,
    getComponentResourceValue,
    getTextResourceFromResourceBinding,
    hasValue
} = require("../../../functions/helpers.js");

describe("CustomFieldBooleanText", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomFieldBooleanText({});
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should use trueText when condition is true", () => {
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.data).toBe("Ja");
        expect(instance.isEmpty).toBe(false);
    });

    it("should use falseText when condition is false", () => {
        getComponentDataValue.mockReturnValue(false);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.data).toBe("Nei");
        expect(instance.isEmpty).toBe(false);
    });

    it("should use defaultText when condition is neither true nor false", () => {
        getComponentDataValue.mockReturnValue(null);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.data).toBe("-");
        expect(instance.isEmpty).toBe(false);
    });

    it("should use fallback texts if booleanTextValues are missing", () => {
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({});
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.data).toBe(undefined);
    });

    it("should use fallback defaultText if booleanTextValues.defaultText is missing", () => {
        getComponentDataValue.mockReturnValue("unknown");
        getComponentBooleanTextValues.mockReturnValue({});
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.data).toBe(undefined);
    });

    it("should set isEmpty and use emptyFieldText when hasContent returns false", () => {
        getComponentDataValue.mockReturnValue(null);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-",
            emptyFieldText: "Tomt"
        });
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Tomt");

        const instance = new CustomFieldBooleanText({});
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Tomt");
    });

    it("should use default emptyFieldText if not provided", () => {
        getComponentDataValue.mockReturnValue(null);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("resource.emptyFieldText.default");

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.data).toBe("resource.emptyFieldText.default");
    });

    it("should not set emptyFieldText if hideIfEmpty is true", () => {
        getComponentDataValue.mockReturnValue(null);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue(undefined);

        const instance = new CustomFieldBooleanText({ hideIfEmpty: true });
        expect(instance.resourceValues.data).toBe(undefined);
    });

    it("should set title if hideTitle is not true", () => {
        getComponentResourceValue.mockReturnValue("Tittel");
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({});
        expect(instance.resourceValues.title).toBe("Tittel");
    });

    it("should not set title if hideTitle is true", () => {
        getComponentResourceValue.mockReturnValue("Tittel");
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "-"
        });
        hasValue.mockReturnValue(true);

        const instance = new CustomFieldBooleanText({ hideTitle: true });
        expect(instance.resourceValues.title).toBe(false);
    });

    it("getResourceBindings should return correct bindings", () => {
        const instance = new CustomFieldBooleanText({
            resourceBindings: {
                trueText: "YES",
                falseText: "NO",
                defaultText: "N/A",
                emptyFieldText: "EMPTY"
            }
        });
        const bindings = instance.getResourceBindings({
            resourceBindings: {
                trueText: "YES",
                falseText: "NO",
                defaultText: "N/A",
                emptyFieldText: "EMPTY"
            }
        });
        expect(bindings.booleanText.trueText).toBe("YES");
        expect(bindings.booleanText.falseText).toBe("NO");
        expect(bindings.booleanText.defaultText).toBe("N/A");
        expect(bindings.booleanText.emptyFieldText).toBe("EMPTY");
    });

    it("getResourceBindings should use defaults if not provided", () => {
        const instance = new CustomFieldBooleanText({});
        const bindings = instance.getResourceBindings({});
        expect(bindings.booleanText.trueText).toBe("resource.trueText.default");
        expect(bindings.booleanText.falseText).toBe("resource.falseText.default");
        expect(bindings.booleanText.defaultText).toBe("resource.emptyFieldText.default");
        expect(bindings.booleanText.emptyFieldText).toBe("resource.emptyFieldText.default");
    });
});
