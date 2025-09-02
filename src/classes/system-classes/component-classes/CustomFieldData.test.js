import CustomFieldData from "./CustomFieldData.js";
import { getComponentDataTitle, getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataTitle: jest.fn(),
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/dataFormatHelpers.js", () => ({
    formatString: jest.fn()
}));

describe("CustomFieldData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty and resourceValues correctly when data is present", () => {
        getComponentDataValue.mockReturnValue("value");
        formatString.mockReturnValue("formattedValue");
        getComponentDataTitle.mockReturnValue("Title");
        hasValue.mockImplementation((val) => !!val);
        getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings?.[key]);

        const props = {
            hideTitle: false,
            resourceBindings: { emptyFieldText: "No data", title: "Resource Title" },
            text: "Fallback Text",
            format: "format"
        };

        const instance = new CustomFieldData(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.title).toBe("Title");
        expect(instance.resourceValues.data).toBe("formattedValue");
    });

    it("should use emptyFieldText when data is empty", () => {
        getComponentDataValue.mockReturnValue("");
        formatString.mockReturnValue("");
        getComponentDataTitle.mockReturnValue("");
        hasValue.mockImplementation((val) => !!val);
        getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings?.[key]);

        const props = {
            hideTitle: false,
            resourceBindings: { emptyFieldText: "No data", title: "Resource Title" },
            text: "Fallback Text",
            format: "format"
        };

        const instance = new CustomFieldData(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("No data");
        expect(instance.resourceValues.title).toBe("Resource Title");
    });

    it("should hide title when hideTitle is true", () => {
        getComponentDataValue.mockReturnValue("value");
        formatString.mockReturnValue("formattedValue");
        getComponentDataTitle.mockReturnValue("Title");
        hasValue.mockImplementation((val) => !!val);
        getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings?.[key]);

        const props = {
            hideTitle: true,
            resourceBindings: { emptyFieldText: "No data", title: "Resource Title" },
            text: "Fallback Text",
            format: "format"
        };

        const instance = new CustomFieldData(props);

        expect(instance.resourceValues.title).toBe(false);
    });

    it("getTextData returns resource title if present", () => {
        getComponentResourceValue.mockReturnValue("Resource Title");
        hasValue.mockReturnValue(true);

        const props = { resourceBindings: { title: "Resource Title" }, text: "Fallback Text" };
        const instance = new CustomFieldData(props);

        expect(instance.getTextData(props)).toBe("Resource Title");
    });

    it("getTextData returns text if resource title is not present", () => {
        getComponentResourceValue.mockReturnValue("");
        hasValue.mockReturnValue(false);

        const props = { resourceBindings: {}, text: "Fallback Text" };
        const instance = new CustomFieldData(props);

        expect(instance.getTextData(props)).toBe("Fallback Text");
    });

    it("hasContent returns result of hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomFieldData({});
        expect(instance.hasContent("something")).toBe(true);

        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValueFromFormData formats data", () => {
        getComponentDataValue.mockReturnValue("raw");
        formatString.mockReturnValue("formatted");
        const props = { format: "fmt" };
        const instance = new CustomFieldData(props);
        expect(instance.getValueFromFormData(props)).toBe("formatted");
        expect(formatString).toHaveBeenCalledWith("raw", "fmt");
    });
});
