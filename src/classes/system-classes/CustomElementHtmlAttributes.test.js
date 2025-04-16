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
        it("should initialize properties correctly based on props", () => {
            const props = {
                formData: { key: "value" },
                text: "Sample Text",
                size: "h1",
                hideTitle: false,
                hideIfEmpty: false,
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
            expect(instance.hideIfEmpty).toBeUndefined();
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
        it("should return JSON stringified formData when valid", () => {
            const props = { formData: { key: "value" } };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFormDataAttributeFromProps(props);

            expect(result).toBe(JSON.stringify(props.formData));
        });

        it("should return null when formData is invalid", () => {
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
        it("should return size as lowercase string when valid", () => {
            const props = { size: "LARGE" };
            isValidHeaderSize.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getSizeAttributeFromProps(props);

            expect(result).toBe("large");
        });

        it("should return undefined when size is invalid", () => {
            const props = { size: "INVALID" };
            isValidHeaderSize.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getSizeAttributeFromProps(props);

            expect(result).toBeUndefined();
        });
    });

    describe("getHideTitleAttributeFromProps", () => {
        it('should return "true" when hideTitle is true', () => {
            const props = { hideTitle: true };

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getHideTitleAttributeFromProps(props);

            expect(result).toBe("true");
        });

        it("should return undefined when hideTitle is false", () => {
            const props = { hideTitle: false };

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getHideTitleAttributeFromProps(props);

            expect(result).toBeUndefined();
        });
    });

    describe("getStyleOverrideAttributeFromProps", () => {
        it("should return JSON stringified styleOverride when valid", () => {
            const props = { styleOverride: { color: "red" } };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getStyleOverrideAttributeFromProps(props);

            expect(result).toBe(JSON.stringify(props.styleOverride));
        });

        it("should return undefined when styleOverride is invalid", () => {
            const props = { styleOverride: null };
            hasValue.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getStyleOverrideAttributeFromProps(props);

            expect(result).toBeUndefined();
        });
    });

    describe("getFeedbackTypeAttributeFromProps", () => {
        it("should return feedbackType when valid", () => {
            const props = { feedbackType: "success" };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFeedbackTypeAttributeFromProps(props);

            expect(result).toBe("success");
        });

        it('should return "default" when feedbackType is invalid', () => {
            const props = { feedbackType: "invalid" };
            hasValue.mockReturnValue(true);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFeedbackTypeAttributeFromProps(props);

            expect(result).toBe("default");
        });

        it("should return null when feedbackType is not provided", () => {
            const props = {};
            hasValue.mockReturnValue(false);

            const instance = new CustomElementHtmlAttributes({});
            const result = instance.getFeedbackTypeAttributeFromProps(props);

            expect(result).toBeNull();
        });
    });
});
