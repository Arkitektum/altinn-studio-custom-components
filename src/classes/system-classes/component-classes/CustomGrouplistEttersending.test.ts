import { getTextResourceFromResourceBinding, getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGrouplistEttersending from "./CustomGrouplistEttersending.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

// Mocks for global functions and dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGrouplistEttersending", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true when data is empty", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty text");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty text");
    });

    it("should set isEmpty to false when data has value", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("Some data");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("Some data");
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("Some data");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["Missing resource"]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {};
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.validationMessages).toEqual(["Missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getResourceBindings should use default values when not overridden", () => {
        const instance = new CustomGrouplistEttersending({});
        const bindings = instance.getResourceBindings({});
        expect(bindings.ettersendinger!.title).toBe("resource.ettersendinger.title");
        expect(bindings.ettersendinger!.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("getResourceBindings should use custom resourceBindings when provided", () => {
        const props = {
            resourceBindings: {
                title: "custom.title",
                emptyFieldText: "custom.emptyFieldText"
            }
        };
        const instance = new CustomGrouplistEttersending(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.ettersendinger!.title).toBe("custom.title");
        expect(bindings.ettersendinger!.emptyFieldText).toBe("custom.emptyFieldText");
    });

    it("getResourceBindings should hide title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGrouplistEttersending(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.ettersendinger!.title).toBeUndefined();
    });

    it("getResourceBindings should hide emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGrouplistEttersending(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.ettersendinger!.emptyFieldText).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGrouplistEttersending({});
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        expect(instance.hasContent("data")).toBe(true);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should delegate to hasMissingTextResources", () => {
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);
        const instance = new CustomGrouplistEttersending({});
        const result = instance.getValidationMessages({ ettersendinger: {} });
        expect(result).toEqual(["missing"]);
        expect(hasMissingTextResources).toHaveBeenCalled();
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("value");
        const instance = new CustomGrouplistEttersending({});
        expect(instance.getValueFromFormData({})).toBe("value");
        expect(getComponentDataValue).toHaveBeenCalled();
    });
});
