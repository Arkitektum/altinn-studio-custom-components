import CustomElementHtmlAttributes from "./CustomElementHtmlAttributes";
import { isValidHeaderSize } from "../../functions/dataFormatHelpers.js";
import { hasValue } from "../../functions/helpers.js";

jest.mock("../../functions/dataFormatHelpers.js", () => ({
    isValidHeaderSize: jest.fn()
}));

jest.mock("../../functions/helpers.js", () => ({
    hasValue: jest.fn()
}));

describe("CustomElementHtmlAttributes", () => {
    describe("constructor", () => {
        it("should initialize attributes based on props", () => {
            const props = {
                formData: { key: "value" },
                text: "Sample Text",
                size: "h1",
                hideTitle: false,
                hideIfEmpty: true,
                inline: true,
                styleOverride: { color: "red" },
                grid: { xs: 6 },
                texts: { title: "Title" },
                tableColumns: [{ name: "Column1" }],
                textResources: { key: "value" },
                itemKey: "item-1",
                id: "component-1",
                feedbackType: "success",
                hideOrgNr: true,
                format: "date",
                showRowNumbers: true
            };

            hasValue.mockReturnValue(true);
            isValidHeaderSize.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.isChildComponent).toBe("true");
            expect(instance.formData).toBe(JSON.stringify(props.formData));
            expect(instance.text).toBe(props.text);
            expect(instance.size).toBe(props.size.toLowerCase());
            expect(instance.hideTitle).toBeUndefined();
            expect(instance.hideIfEmpty).toBe("true");
            expect(instance.inline).toBe("true");
            expect(instance.styleOverride).toBe(JSON.stringify(props.styleOverride));
            expect(instance.grid).toBe(JSON.stringify(props.grid));
            expect(instance.texts).toBe(JSON.stringify(props.texts));
            expect(instance.tableColumns).toBe(JSON.stringify(props.tableColumns));
            expect(instance.textResources).toBe(JSON.stringify(props.textResources));
            expect(instance.itemKey).toBe(props.itemKey);
            expect(instance.id).toBe(props.id);
            expect(instance.feedbackType).toBe(props.feedbackType);
            expect(instance.hideOrgNr).toBe("true");
            expect(instance.format).toBe(props.format);
            expect(instance.showRowNumbers).toBe("true");
        });
    });

    describe("getFormDataAttributeFromProps", () => {
        it("should return JSON string for valid formData", () => {
            const props = { formData: { key: "value" } };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBe(JSON.stringify(props.formData));
        });

        it("should return null for invalid formData", () => {
            const props = { formData: null };
            hasValue.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBeNull();
        });
    });

    describe("getTextAttributeFromProps", () => {
        it("should return text when hideTitle is false", () => {
            const props = { text: "Sample Text", hideTitle: false };

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getTextAttributeFromProps(props);

            expect(result).toBe(props.text);
        });

        it("should return empty string when hideTitle is true", () => {
            const props = { text: "Sample Text", hideTitle: true };

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getTextAttributeFromProps(props);

            expect(result).toBe("");
        });
    });

    describe("getSizeAttributeFromProps", () => {
        it("should return size as lowercase string if valid", () => {
            const props = { size: "LARGE" };
            isValidHeaderSize.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getSizeAttributeFromProps(props);

            expect(result).toBe("large");
        });

        it("should return undefined if size is invalid", () => {
            const props = { size: "INVALID" };
            isValidHeaderSize.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getSizeAttributeFromProps(props);

            expect(result).toBeUndefined();
        });
    });

    describe("getHideTitleAttributeFromProps", () => {
        it('should return "true" if hideTitle is true', () => {
            const props = { hideTitle: true };

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getHideTitleAttributeFromProps(props);

            expect(result).toBe("true");
        });

        it("should return undefined if hideTitle is false", () => {
            const props = { hideTitle: false };

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getHideTitleAttributeFromProps(props);

            expect(result).toBeUndefined();
        });
    });

    describe("getFeedbackTypeAttributeFromProps", () => {
        it("should return valid feedbackType", () => {
            const props = { feedbackType: "success" };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFeedbackTypeAttributeFromProps(props);

            expect(result).toBe("success");
        });

        it('should return "default" for invalid feedbackType', () => {
            const props = { feedbackType: "invalid" };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFeedbackTypeAttributeFromProps(props);

            expect(result).toBe("default");
        });

        it("should return null if feedbackType is not provided", () => {
            const props = {};
            hasValue.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFeedbackTypeAttributeFromProps(props);

            expect(result).toBeNull();
        });
    });

    describe("CustomElementHtmlAttributes constructor", () => {
        it("should initialize all attributes correctly when valid props are provided", () => {
            const props = {
                formData: { key: "value" },
                text: "Sample Text",
                size: "large",
                hideTitle: false,
                hideIfEmpty: true,
                inline: true,
                styleOverride: { color: "red" },
                grid: { columns: 3 },
                texts: ["Text1", "Text2"],
                tableColumns: ["Column1", "Column2"],
                textResources: { key: "value" },
                itemKey: "item1",
                id: "id1",
                feedbackType: "success",
                hideOrgNr: true,
                format: "json",
                showRowNumbers: true
            };

            hasValue.mockReturnValue(true);
            isValidHeaderSize.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.isChildComponent).toBe("true");
            expect(instance.formData).toBe(JSON.stringify(props.formData));
            expect(instance.text).toBe(props.text);
            expect(instance.size).toBe(props.size.toLowerCase());
            expect(instance.hideTitle).toBeUndefined();
            expect(instance.hideIfEmpty).toBe("true");
            expect(instance.inline).toBe("true");
            expect(instance.styleOverride).toBe(JSON.stringify(props.styleOverride));
            expect(instance.grid).toBe(JSON.stringify(props.grid));
            expect(instance.texts).toBe(JSON.stringify(props.texts));
            expect(instance.tableColumns).toBe(JSON.stringify(props.tableColumns));
            expect(instance.textResources).toBe(JSON.stringify(props.textResources));
            expect(instance.itemKey).toBe(props.itemKey);
            expect(instance.id).toBe(props.id);
            expect(instance.feedbackType).toBe(props.feedbackType);
            expect(instance.hideOrgNr).toBe("true");
            expect(instance.format).toBe(props.format);
            expect(instance.showRowNumbers).toBe("true");
        });

        it("should handle missing optional props gracefully", () => {
            const props = {
                text: "Sample Text",
                size: "large",
                hideTitle: true
            };

            hasValue.mockReturnValue(false);
            isValidHeaderSize.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.isChildComponent).toBe("true");
            expect(instance.formData).toBeUndefined();
            expect(instance.text).toBeUndefined();
            expect(instance.size).toBe(props.size.toLowerCase());
            expect(instance.hideTitle).toBe("true");
            expect(instance.hideIfEmpty).toBeUndefined();
            expect(instance.inline).toBeUndefined();
            expect(instance.styleOverride).toBeUndefined();
            expect(instance.grid).toBeUndefined();
            expect(instance.texts).toBeUndefined();
            expect(instance.tableColumns).toBeUndefined();
            expect(instance.textResources).toBeUndefined();
            expect(instance.itemKey).toBeUndefined();
            expect(instance.id).toBeUndefined();
            expect(instance.feedbackType).toBeUndefined();
            expect(instance.hideOrgNr).toBeUndefined();
            expect(instance.format).toBeUndefined();
            expect(instance.showRowNumbers).toBeUndefined();
        });

        it("should set default values for attributes when props are empty", () => {
            const props = {};

            hasValue.mockReturnValue(false);
            isValidHeaderSize.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.isChildComponent).toBe("true");
            expect(instance.formData).toBeUndefined();
            expect(instance.text).toBeUndefined();
            expect(instance.size).toBeUndefined();
            expect(instance.hideTitle).toBeUndefined();
            expect(instance.hideIfEmpty).toBeUndefined();
            expect(instance.inline).toBeUndefined();
            expect(instance.styleOverride).toBeUndefined();
            expect(instance.grid).toBeUndefined();
            expect(instance.texts).toBeUndefined();
            expect(instance.tableColumns).toBeUndefined();
            expect(instance.textResources).toBeUndefined();
            expect(instance.itemKey).toBeUndefined();
            expect(instance.id).toBeUndefined();
            expect(instance.feedbackType).toBeUndefined();
            expect(instance.hideOrgNr).toBeUndefined();
            expect(instance.format).toBeUndefined();
            expect(instance.showRowNumbers).toBeUndefined();
        });
    });

    describe("getFormDataAttributeFromProps", () => {
        it("should return JSON string for string formData", () => {
            const props = { formData: "sample string" };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBe(JSON.stringify(props.formData));
        });

        it("should return JSON string for number formData", () => {
            const props = { formData: 12345 };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBe(JSON.stringify(props.formData.toString()));
        });

        it("should return JSON string for object formData", () => {
            const props = { formData: { key: "value" } };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBe(JSON.stringify(props.formData));
        });

        it("should return null for null formData", () => {
            const props = { formData: null };
            hasValue.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBeNull();
        });

        it("should return null for undefined formData", () => {
            const props = {};
            hasValue.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBeNull();
        });
    });
});
