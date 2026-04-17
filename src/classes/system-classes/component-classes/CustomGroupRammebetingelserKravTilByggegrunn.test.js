import CustomGroupRammebetingelserKravTilByggegrunn from "./CustomGroupRammebetingelserKravTilByggegrunn";
import KravTilByggegrunn from "../../data-classes/KravTilByggegrunn";

jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResourceFromResourceBinding: jest.fn((key) => `text-for-${key}`),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));

jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(() => ["missing-resource"]),
    hasValidationMessages: jest.fn((messages) => Array.isArray(messages) && messages.length > 0)
}));

jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn((props) => props?.formData || null)
}));

describe("CustomGroupRammebetingelserKravTilByggegrunn", () => {
    afterEach(() => jest.clearAllMocks());

    it("should initialize with correct properties when data and resources are provided", () => {
        const props = {
            formData: { harMiljoeforhold: true },
            resourceValues: { title: "Custom Title" },
            resourceBindings: { title: "custom.title", emptyFieldText: "custom.empty" }
        };
        const instance = new CustomGroupRammebetingelserKravTilByggegrunn(props);
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toEqual(["missing-resource"]);
        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.resourceBindings.rammebetingelserKravTilByggegrunn.title).toBe("custom.title");
        expect(instance.resourceBindings.rammebetingelserKravTilByggegrunn.emptyFieldText).toBe("custom.empty");
        expect(instance.resourceValues.title).toBe("Custom Title");
        expect(instance.resourceValues.data).toBeInstanceOf(KravTilByggegrunn);
    });

    it("should use default resource keys if not provided", () => {
        const props = { formData: { harMiljoeforhold: false } };
        const instance = new CustomGroupRammebetingelserKravTilByggegrunn(props);
        expect(instance.resourceBindings.rammebetingelserKravTilByggegrunn.title).toBe("resource.kravTilByggegrunn.title");
        expect(instance.resourceBindings.rammebetingelserKravTilByggegrunn.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("should omit title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupRammebetingelserKravTilByggegrunn(props);
        expect(instance.resourceBindings.rammebetingelserKravTilByggegrunn?.title).toBeUndefined();
    });

    it("should omit emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupRammebetingelserKravTilByggegrunn(props);
        expect(instance.resourceBindings.rammebetingelserKravTilByggegrunn?.emptyFieldText).toBeUndefined();
    });

    it("should return correct component usage", () => {
        const instance = new CustomGroupRammebetingelserKravTilByggegrunn({});
        expect(instance.getComponentUsage()).toEqual([
            "custom-feedbacklist-validation-messages",
            "custom-field-boolean-text",
            "custom-header-text",
            "custom-paragraph",
            "custom-table-omraaderisiko"
        ]);
    });
});
