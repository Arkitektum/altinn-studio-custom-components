import CustomGroupLoefteinnretninger from "./CustomGroupLoefteinnretninger";
import {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Loefteinnretninger.js", () => {
    return jest.fn().mockImplementation((data) => ({ mockData: data }));
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

describe("CustomGroupLoefteinnretninger", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data has no content", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("empty");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty");
    });

    it("should set isEmpty to false if data has content", () => {
        getComponentDataValue.mockReturnValue("someData");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockReturnValue("title");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toEqual({ mockData: "someData" });
    });

    it("should use resourceValues.title from props if present and hasValue returns true", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockImplementation((val) => val === "customTitle");
        getTextResourceFromResourceBinding.mockReturnValue("fallbackTitle");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = { resourceValues: { title: "customTitle" } };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceValues.title).toBe("customTitle");
    });

    it("should fallback to resourceBinding title if resourceValues.title is not present", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("fallbackTitle");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith(
            "resource.rammebetingelser.loefteinnretninger.title"
        );
        expect(instance.resourceValues.title).toBe("fallbackTitle");
    });

    it("should call getValidationMessages and set validationMessages and hasValidationMessages", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockReturnValue("title");
        hasMissingTextResources.mockReturnValue(["msg1"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.validationMessages).toEqual(["msg1"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getResourceBindings should omit loefteinnretninger.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceBindings.loefteinnretninger?.title).toBeUndefined();
    });

    it("getResourceBindings should omit loefteinnretninger.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceBindings.loefteinnretninger?.emptyFieldText).toBeUndefined();
    });

    it("getResourceBindings should use custom resourceBindings if provided", () => {
        const props = {
            resourceBindings: {
                planleggesHeis: { title: "custom.heis.title" },
                title: "custom.main.title",
                emptyFieldText: "custom.empty.text"
            }
        };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceBindings.planleggesHeis.title).toBe("custom.heis.title");
        expect(instance.resourceBindings.loefteinnretninger.title).toBe("custom.main.title");
        expect(instance.resourceBindings.loefteinnretninger.emptyFieldText).toBe("custom.empty.text");
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupLoefteinnretninger({});
        expect(instance.hasContent("abc")).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        getTextResources.mockReturnValue("resources");
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = new CustomGroupLoefteinnretninger({});
        const result = instance.getValidationMessages({ foo: "bar" });
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
        expect(result).toEqual(["missing"]);
    });

    it("getValueFromFormData should return Loefteinnretninger instance", () => {
        getComponentDataValue.mockReturnValue("data");
        const instance = new CustomGroupLoefteinnretninger({});
        const result = instance.getValueFromFormData({});
        expect(result).toEqual({ mockData: "data" });
    });
});
