import CustomElementHtmlAttributes from "./CustomElementHtmlAttributes";
const { isValidHeaderSize } = require("../../functions/dataFormatHelpers.js");
const { hasValue } = require("../../functions/helpers.js");

// Mock dependencies
jest.mock("../../functions/dataFormatHelpers.js", () => ({
    isValidHeaderSize: jest.fn()
}));
jest.mock("../../functions/helpers.js", () => ({
    hasValue: jest.fn()
}));

describe("CustomElementHtmlAttributes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set properties if provided and valid", () => {
            isValidHeaderSize.mockReturnValue(true);
            hasValue.mockImplementation((v) => v !== undefined && v !== null);

            const props = {
                isChildComponent: true,
                formData: { foo: "bar" },
                tagName: "custom-tag",
                size: "large",
                hideTitle: true,
                hideIfEmpty: true,
                isEmpty: true,
                inline: true,
                styleOverride: { color: "red" },
                grid: { xs: 12 },
                tableColumns: [{ name: "col1" }],
                itemKey: "item-1",
                id: "id-123",
                feedbackType: "error",
                hideOrgNr: true,
                format: "date",
                showRowNumbers: true,
                partType: "main",
                resourceBindings: { title: "titleKey" },
                resourceValues: { a: 1 }
            };

            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.isChildComponent).toBe("true");
            expect(instance.formData).toBe(JSON.stringify(props.formData));
            expect(instance.tagName).toBe("custom-tag");
            expect(instance.size).toBe("large");
            expect(instance.hideTitle).toBe("true");
            expect(instance.hideIfEmpty).toBe("true");
            expect(instance.isEmpty).toBe("true");
            expect(instance.inline).toBe("true");
            expect(instance.styleOverride).toBe(JSON.stringify(props.styleOverride));
            expect(instance.grid).toBe(JSON.stringify(props.grid));
            expect(instance.tableColumns).toBe(JSON.stringify(props.tableColumns));
            expect(instance.itemKey).toBe("item-1");
            expect(instance.id).toBe("id-123");
            expect(instance.feedbackType).toBe("error");
            expect(instance.hideOrgNr).toBe("true");
            expect(instance.format).toBe("date");
            expect(instance.showRowNumbers).toBe("true");
            expect(instance.partType).toBe("main");
            expect(instance.resourceBindings).toBe(JSON.stringify(props.resourceBindings));
            expect(instance.resourceValues).toBe(JSON.stringify(props.resourceValues));
        });

        it("should not set properties if not provided or invalid", () => {
            isValidHeaderSize.mockReturnValue(false);
            hasValue.mockReturnValue(false);

            const props = {};
            const instance = new CustomElementHtmlAttributes(props);

            expect(instance).not.toHaveProperty("isChildComponent");
            expect(instance).not.toHaveProperty("formData");
            expect(instance).not.toHaveProperty("tagName");
            expect(instance).not.toHaveProperty("size");
            expect(instance).not.toHaveProperty("hideTitle");
            expect(instance).not.toHaveProperty("hideIfEmpty");
            expect(instance).not.toHaveProperty("isEmpty");
            expect(instance).not.toHaveProperty("inline");
            expect(instance).not.toHaveProperty("styleOverride");
            expect(instance).not.toHaveProperty("grid");
            expect(instance).not.toHaveProperty("tableColumns");
            expect(instance).not.toHaveProperty("itemKey");
            expect(instance).not.toHaveProperty("id");
            expect(instance).not.toHaveProperty("feedbackType");
            expect(instance).not.toHaveProperty("hideOrgNr");
            expect(instance).not.toHaveProperty("format");
            expect(instance).not.toHaveProperty("showRowNumbers");
            expect(instance).not.toHaveProperty("partType");
            expect(instance).not.toHaveProperty("resourceBindings");
            expect(instance).not.toHaveProperty("resourceValues");
        });
    });

    describe("getFormDataAttributeFromProps", () => {
        beforeEach(() => {
            hasValue.mockImplementation((v) => v !== undefined && v !== null);
        });

        it("should stringify string formData", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFormDataAttributeFromProps({ formData: "abc" })).toBe(JSON.stringify("abc"));
        });

        it("should stringify number formData", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFormDataAttributeFromProps({ formData: 123 })).toBe(JSON.stringify("123"));
        });

        it("should stringify object formData", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFormDataAttributeFromProps({ formData: { a: 1 } })).toBe(JSON.stringify({ a: 1 }));
        });

        it("should return null if formData is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFormDataAttributeFromProps({})).toBeNull();
        });
    });

    describe("getIsChildComponentAttributeFromProps", () => {
        it('should return "true" if isChildComponent is truthy', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getIsChildComponentAttributeFromProps({ isChildComponent: true })).toBe("true");
        });
        it("should return undefined if isChildComponent is falsy", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getIsChildComponentAttributeFromProps({ isChildComponent: false })).toBeUndefined();
        });
    });

    describe("getTagNameAttributeFromProps", () => {
        it("should return tagName as string if present", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getTagNameAttributeFromProps({ tagName: "foo" })).toBe("foo");
        });
        it("should return undefined if tagName is not present", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getTagNameAttributeFromProps({})).toBeUndefined();
        });
    });

    describe("getSizeAttributeFromProps", () => {
        it("should return size as string if valid", () => {
            isValidHeaderSize.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getSizeAttributeFromProps({ size: "LARGE" })).toBe("large");
        });
        it("should return undefined if size is not valid", () => {
            isValidHeaderSize.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getSizeAttributeFromProps({ size: "invalid" })).toBeUndefined();
        });
    });

    describe("getHideTitleAttributeFromProps", () => {
        it('should return "true" if hideTitle is true', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getHideTitleAttributeFromProps({ hideTitle: true })).toBe("true");
            expect(instance.getHideTitleAttributeFromProps({ hideTitle: "true" })).toBe("true");
        });
        it("should return undefined if hideTitle is false", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getHideTitleAttributeFromProps({ hideTitle: false })).toBeUndefined();
        });
    });

    describe("getHideIfEmptyAttributeFromProps", () => {
        it('should return "true" if hideIfEmpty is true', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getHideIfEmptyAttributeFromProps({ hideIfEmpty: true })).toBe("true");
            expect(instance.getHideIfEmptyAttributeFromProps({ hideIfEmpty: "true" })).toBe("true");
        });
        it("should return undefined if hideIfEmpty is false", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getHideIfEmptyAttributeFromProps({ hideIfEmpty: false })).toBeUndefined();
        });
    });

    describe("getIsEmptyAttributeFromProps", () => {
        it('should return "true" if isEmpty is true', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getIsEmptyAttributeFromProps({ isEmpty: true })).toBe("true");
            expect(instance.getIsEmptyAttributeFromProps({ isEmpty: "true" })).toBe("true");
        });
        it("should return undefined if isEmpty is false", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getIsEmptyAttributeFromProps({ isEmpty: false })).toBeUndefined();
        });
    });

    describe("getInlineAttributeFromProps", () => {
        it('should return "true" if inline is true', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getInlineAttributeFromProps({ inline: true })).toBe("true");
            expect(instance.getInlineAttributeFromProps({ inline: "true" })).toBe("true");
        });
        it("should return undefined if inline is false", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getInlineAttributeFromProps({ inline: false })).toBeUndefined();
        });
    });

    describe("getStyleOverrideAttributeFromProps", () => {
        it("should return JSON string if styleOverride is present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getStyleOverrideAttributeFromProps({ styleOverride: { color: "red" } })).toBe(JSON.stringify({ color: "red" }));
        });
        it("should return undefined if styleOverride is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getStyleOverrideAttributeFromProps({})).toBeUndefined();
        });
    });

    describe("getGridAttributeFromProps", () => {
        it("should return JSON string if grid is present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getGridAttributeFromProps({ grid: { xs: 12 } })).toBe(JSON.stringify({ xs: 12 }));
        });
        it("should return falsey if grid is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getGridAttributeFromProps({})).toBe(false);
        });
    });

    describe("getTableColumnsAttributeFromProps", () => {
        it("should return JSON string if tableColumns is present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getTableColumnsAttributeFromProps({ tableColumns: [1, 2] })).toBe(JSON.stringify([1, 2]));
        });
        it("should return falsey if tableColumns is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getTableColumnsAttributeFromProps({})).toBe(false);
        });
    });

    describe("getItemKeyAttributeFromProps", () => {
        it("should return itemKey if present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getItemKeyAttributeFromProps({ itemKey: "key" })).toBe("key");
        });
        it("should return falsey if itemKey is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getItemKeyAttributeFromProps({})).toBe(false);
        });
    });

    describe("getIdAttributeFromProps", () => {
        it("should return id if present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getIdAttributeFromProps({ id: "id" })).toBe("id");
        });
        it("should return falsey if id is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getIdAttributeFromProps({})).toBe(false);
        });
    });

    describe("getFeedbackTypeAttributeFromProps", () => {
        it("should return feedbackType if valid", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFeedbackTypeAttributeFromProps({ feedbackType: "success" })).toBe("success");
        });
        it('should return "default" if feedbackType is invalid', () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFeedbackTypeAttributeFromProps({ feedbackType: "not-valid" })).toBe("default");
        });
        it("should return null if feedbackType is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFeedbackTypeAttributeFromProps({})).toBeNull();
        });
    });

    describe("getHideOrgNr", () => {
        it('should return "true" if hideOrgNr is true', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getHideOrgNr({ hideOrgNr: true })).toBe("true");
            expect(instance.getHideOrgNr({ hideOrgNr: "true" })).toBe("true");
        });
        it("should return undefined if hideOrgNr is false", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getHideOrgNr({ hideOrgNr: false })).toBeUndefined();
        });
    });

    describe("getFormatAttributeFromProps", () => {
        it("should return format as string if present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFormatAttributeFromProps({ format: 123 })).toBe("123");
        });
        it("should return falsey if format is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getFormatAttributeFromProps({})).toBe(false);
        });
    });

    describe("getShowRowNumbersAttributeFromProps", () => {
        it('should return "true" if showRowNumbers is true', () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getShowRowNumbersAttributeFromProps({ showRowNumbers: true })).toBe("true");
            expect(instance.getShowRowNumbersAttributeFromProps({ showRowNumbers: "true" })).toBe("true");
        });
        it("should return undefined if showRowNumbers is false", () => {
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getShowRowNumbersAttributeFromProps({ showRowNumbers: false })).toBeUndefined();
        });
    });

    describe("getPartTypeAttributeFromProps", () => {
        it("should return partType if present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getPartTypeAttributeFromProps({ partType: "main" })).toBe("main");
        });
        it("should return falsey if partType is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getPartTypeAttributeFromProps({})).toBe(false);
        });
    });

    describe("getResourceBindingsFromProps", () => {
        it("should return JSON string if resourceBindings is present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getResourceBindingsFromProps({ resourceBindings: { a: 1 } })).toBe(JSON.stringify({ a: 1 }));
        });
        it("should return falsey if resourceBindings is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getResourceBindingsFromProps({})).toBe(false);
        });
    });

    describe("getResourceValuesFromProps", () => {
        it("should return JSON string if resourceValues is present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getResourceValuesFromProps({ resourceValues: { a: 1 } })).toBe(JSON.stringify({ a: 1 }));
        });
        it("should return null if resourceValues is not present", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomElementHtmlAttributes({});
            expect(instance.getResourceValuesFromProps({})).toBeNull();
        });
    });
});
