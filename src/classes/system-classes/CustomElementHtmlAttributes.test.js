import CustomElementHtmlAttributes from "./CustomElementHtmlAttributes";
const { isValidHeaderSize } = require("../../functions/dataFormatHelpers.js");
const { hasValue } = require("../../functions/helpers.js");

// Mock the imported helpers
jest.mock("../../functions/dataFormatHelpers.js", () => ({
    isValidHeaderSize: jest.fn((size) => ["h1", "h2", "h3", "h4", "h5", "h6"].includes((size || "").toLowerCase()))
}));
jest.mock("../../functions/helpers.js", () => ({
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));

describe("CustomElementHtmlAttributes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default hasValue to real implementation for most tests
        hasValue.mockImplementation((val) => val !== undefined && val !== null && val !== "");
    });

    describe("constructor", () => {
        it("should set all attributes if provided in props", () => {
            isValidHeaderSize.mockReturnValue(true);
            const props = {
                isChildComponent: true,
                formData: { foo: "bar" },
                tagName: "custom-tag",
                size: "h2",
                hideTitle: true,
                hideIfEmpty: true,
                isEmpty: true,
                inline: true,
                styleOverride: { color: "red" },
                grid: { xs: 12 },
                tableColumns: [{ key: "col1" }],
                itemKey: "item-1",
                dataItemKey: "data-1",
                dataTitleItemKey: "title-1",
                id: "id-1",
                feedbackType: "error",
                hideOrgNr: true,
                format: "date",
                showRowNumbers: true,
                partType: "part-1",
                resourceBindings: { title: "Title" },
                resourceValues: { value: 123 },
                enableLinks: true,
                text: "Some text"
            };
            const attrs = new CustomElementHtmlAttributes(props);

            expect(attrs.isChildComponent).toBe("true");
            expect(attrs.formData).toBe(JSON.stringify(props.formData));
            expect(attrs.tagName).toBe("custom-tag");
            expect(attrs.size).toBe("h2");
            expect(attrs.hideTitle).toBe("true");
            expect(attrs.hideIfEmpty).toBe("true");
            expect(attrs.isEmpty).toBe("true");
            expect(attrs.inline).toBe("true");
            expect(attrs.styleOverride).toBe(JSON.stringify(props.styleOverride));
            expect(attrs.grid).toBe(JSON.stringify(props.grid));
            expect(attrs.tableColumns).toBe(JSON.stringify(props.tableColumns));
            expect(attrs.itemKey).toBe("item-1");
            expect(attrs.dataItemKey).toBe("data-1");
            expect(attrs.dataTitleItemKey).toBe("title-1");
            expect(attrs.id).toBe("id-1");
            expect(attrs.feedbackType).toBe("error");
            expect(attrs.hideOrgNr).toBe("true");
            expect(attrs.format).toBe("date");
            expect(attrs.showRowNumbers).toBe("true");
            expect(attrs.partType).toBe("part-1");
            expect(attrs.resourceBindings).toBe(JSON.stringify(props.resourceBindings));
            expect(attrs.resourceValues).toBe(JSON.stringify(props.resourceValues));
            expect(attrs.enableLinks).toBe("true");
            expect(attrs.text).toBe("Some text");
        });

        it("should not set attributes if props are missing or falsy", () => {
            isValidHeaderSize.mockReturnValue(false);
            hasValue.mockReturnValue(false);
            const attrs = new CustomElementHtmlAttributes({});
            expect(attrs).toEqual({});
        });
    });

    describe("getFormDataAttributeFromProps", () => {
        it("should stringify string formData", () => {
            expect(new CustomElementHtmlAttributes({}).getFormDataAttributeFromProps({ formData: "abc" })).toBe('"abc"');
        });
        it("should stringify number formData", () => {
            expect(new CustomElementHtmlAttributes({}).getFormDataAttributeFromProps({ formData: 123 })).toBe('"123"');
        });
        it("should stringify object formData", () => {
            expect(new CustomElementHtmlAttributes({}).getFormDataAttributeFromProps({ formData: { a: 1 } })).toBe('{"a":1}');
        });
        it("should return null if formData is not present", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getFormDataAttributeFromProps({})).toBeNull();
        });
    });

    describe("getIsChildComponentAttributeFromProps", () => {
        it('should return "true" if isChildComponent is truthy', () => {
            expect(new CustomElementHtmlAttributes({}).getIsChildComponentAttributeFromProps({ isChildComponent: true })).toBe("true");
        });
        it("should return undefined if isChildComponent is falsy", () => {
            expect(new CustomElementHtmlAttributes({}).getIsChildComponentAttributeFromProps({ isChildComponent: false })).toBeUndefined();
        });
    });

    describe("getTagNameAttributeFromProps", () => {
        it("should return tagName as string if present", () => {
            expect(new CustomElementHtmlAttributes({}).getTagNameAttributeFromProps({ tagName: "foo" })).toBe("foo");
        });
        it("should return undefined if tagName is missing", () => {
            expect(new CustomElementHtmlAttributes({}).getTagNameAttributeFromProps({})).toBeUndefined();
        });
    });

    describe("getSizeAttributeFromProps", () => {
        it("should return size as lowercase string if valid", () => {
            isValidHeaderSize.mockReturnValue(true);
            expect(new CustomElementHtmlAttributes({}).getSizeAttributeFromProps({ size: "H3" })).toBe("h3");
        });
        it("should return undefined if size is invalid", () => {
            isValidHeaderSize.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getSizeAttributeFromProps({ size: "foo" })).toBeUndefined();
        });
    });

    describe("getHideTitleAttributeFromProps", () => {
        it('should return "true" if hideTitle is true', () => {
            expect(new CustomElementHtmlAttributes({}).getHideTitleAttributeFromProps({ hideTitle: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getHideTitleAttributeFromProps({ hideTitle: "true" })).toBe("true");
        });
        it("should return undefined if hideTitle is false", () => {
            expect(new CustomElementHtmlAttributes({}).getHideTitleAttributeFromProps({ hideTitle: false })).toBeUndefined();
        });
    });

    describe("getHideIfEmptyAttributeFromProps", () => {
        it('should return "true" if hideIfEmpty is true', () => {
            expect(new CustomElementHtmlAttributes({}).getHideIfEmptyAttributeFromProps({ hideIfEmpty: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getHideIfEmptyAttributeFromProps({ hideIfEmpty: "true" })).toBe("true");
        });
        it("should return undefined if hideIfEmpty is false", () => {
            expect(new CustomElementHtmlAttributes({}).getHideIfEmptyAttributeFromProps({ hideIfEmpty: false })).toBeUndefined();
        });
    });

    describe("getIsEmptyAttributeFromProps", () => {
        it('should return "true" if isEmpty is true', () => {
            expect(new CustomElementHtmlAttributes({}).getIsEmptyAttributeFromProps({ isEmpty: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getIsEmptyAttributeFromProps({ isEmpty: "true" })).toBe("true");
        });
        it("should return undefined if isEmpty is false", () => {
            expect(new CustomElementHtmlAttributes({}).getIsEmptyAttributeFromProps({ isEmpty: false })).toBeUndefined();
        });
    });

    describe("getInlineAttributeFromProps", () => {
        it('should return "true" if inline is true', () => {
            expect(new CustomElementHtmlAttributes({}).getInlineAttributeFromProps({ inline: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getInlineAttributeFromProps({ inline: "true" })).toBe("true");
        });
        it("should return undefined if inline is false", () => {
            expect(new CustomElementHtmlAttributes({}).getInlineAttributeFromProps({ inline: false })).toBeUndefined();
        });
    });

    describe("getStyleOverrideAttributeFromProps", () => {
        it("should return JSON string if styleOverride has value", () => {
            expect(new CustomElementHtmlAttributes({}).getStyleOverrideAttributeFromProps({ styleOverride: { color: "red" } })).toBe(
                '{"color":"red"}'
            );
        });
        it("should return undefined if styleOverride is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getStyleOverrideAttributeFromProps({})).toBeUndefined();
        });
    });

    describe("getGridAttributeFromProps", () => {
        it("should return JSON string if grid has value", () => {
            expect(new CustomElementHtmlAttributes({}).getGridAttributeFromProps({ grid: { xs: 12 } })).toBe('{"xs":12}');
        });
        it("should return false if grid is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getGridAttributeFromProps({})).toBe(false);
        });
    });

    describe("getTableColumnsAttributeFromProps", () => {
        it("should return JSON string if tableColumns has value", () => {
            expect(new CustomElementHtmlAttributes({}).getTableColumnsAttributeFromProps({ tableColumns: [1, 2] })).toBe("[1,2]");
        });
        it("should return false if tableColumns is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getTableColumnsAttributeFromProps({})).toBe(false);
        });
    });

    describe("getItemKeyAttributeFromProps", () => {
        it("should return itemKey if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getItemKeyAttributeFromProps({ itemKey: "foo" })).toBe("foo");
        });
        it("should return false if itemKey is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getItemKeyAttributeFromProps({})).toBe(false);
        });
    });

    describe("getDataItemKeyAttributeFromProps", () => {
        it("should return dataItemKey if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getDataItemKeyAttributeFromProps({ dataItemKey: "foo" })).toBe("foo");
        });
        it("should return false if dataItemKey is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getDataItemKeyAttributeFromProps({})).toBe(false);
        });
    });

    describe("getDataTitleItemKeyAttributeFromProps", () => {
        it("should return dataTitleItemKey if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getDataTitleItemKeyAttributeFromProps({ dataTitleItemKey: "foo" })).toBe("foo");
        });
        it("should return false if dataTitleItemKey is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getDataTitleItemKeyAttributeFromProps({})).toBe(false);
        });
    });

    describe("getIdAttributeFromProps", () => {
        it("should return id if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getIdAttributeFromProps({ id: "foo" })).toBe("foo");
        });
        it("should return false if id is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getIdAttributeFromProps({})).toBe(false);
        });
    });

    describe("getFeedbackTypeAttributeFromProps", () => {
        it("should return feedbackType if valid", () => {
            expect(new CustomElementHtmlAttributes({}).getFeedbackTypeAttributeFromProps({ feedbackType: "error" })).toBe("error");
        });
        it('should return "default" if feedbackType is invalid', () => {
            expect(new CustomElementHtmlAttributes({}).getFeedbackTypeAttributeFromProps({ feedbackType: "invalid" })).toBe("default");
        });
        it("should return null if feedbackType is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getFeedbackTypeAttributeFromProps({})).toBeNull();
        });
    });

    describe("getHideOrgNr", () => {
        it('should return "true" if hideOrgNr is true', () => {
            expect(new CustomElementHtmlAttributes({}).getHideOrgNr({ hideOrgNr: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getHideOrgNr({ hideOrgNr: "true" })).toBe("true");
        });
        it("should return undefined if hideOrgNr is false", () => {
            expect(new CustomElementHtmlAttributes({}).getHideOrgNr({ hideOrgNr: false })).toBeUndefined();
        });
    });

    describe("getFormatAttributeFromProps", () => {
        it("should return format as string if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getFormatAttributeFromProps({ format: 123 })).toBe("123");
            expect(new CustomElementHtmlAttributes({}).getFormatAttributeFromProps({ format: "abc" })).toBe("abc");
        });
        it("should return false if format is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getFormatAttributeFromProps({})).toBe(false);
        });
    });

    describe("getShowRowNumbersAttributeFromProps", () => {
        it('should return "true" if showRowNumbers is true', () => {
            expect(new CustomElementHtmlAttributes({}).getShowRowNumbersAttributeFromProps({ showRowNumbers: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getShowRowNumbersAttributeFromProps({ showRowNumbers: "true" })).toBe("true");
        });
        it("should return undefined if showRowNumbers is false", () => {
            expect(new CustomElementHtmlAttributes({}).getShowRowNumbersAttributeFromProps({ showRowNumbers: false })).toBeUndefined();
        });
    });

    describe("getPartTypeAttributeFromProps", () => {
        it("should return partType if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getPartTypeAttributeFromProps({ partType: "foo" })).toBe("foo");
        });
        it("should return false if partType is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getPartTypeAttributeFromProps({})).toBe(false);
        });
    });

    describe("getResourceBindingsFromProps", () => {
        it("should return JSON string if resourceBindings has value", () => {
            expect(new CustomElementHtmlAttributes({}).getResourceBindingsFromProps({ resourceBindings: { a: 1 } })).toBe('{"a":1}');
        });
        it("should return false if resourceBindings is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getResourceBindingsFromProps({})).toBe(false);
        });
    });

    describe("getResourceValuesFromProps", () => {
        it("should return JSON string if resourceValues has value", () => {
            expect(new CustomElementHtmlAttributes({}).getResourceValuesFromProps({ resourceValues: { a: 1 } })).toBe('{"a":1}');
        });
        it("should return null if resourceValues is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getResourceValuesFromProps({})).toBeNull();
        });
    });

    describe("getEnableLinksFromProps", () => {
        it('should return "true" if enableLinks is true', () => {
            expect(new CustomElementHtmlAttributes({}).getEnableLinksFromProps({ enableLinks: true })).toBe("true");
            expect(new CustomElementHtmlAttributes({}).getEnableLinksFromProps({ enableLinks: "true" })).toBe("true");
        });
        it("should return undefined if enableLinks is false", () => {
            expect(new CustomElementHtmlAttributes({}).getEnableLinksFromProps({ enableLinks: false })).toBeUndefined();
        });
    });

    describe("getTextAttributeFromProps", () => {
        it("should return text if has value", () => {
            expect(new CustomElementHtmlAttributes({}).getTextAttributeFromProps({ text: "foo" })).toBe("foo");
        });
        it("should return false if text is missing", () => {
            hasValue.mockReturnValue(false);
            expect(new CustomElementHtmlAttributes({}).getTextAttributeFromProps({})).toBe(false);
        });
    });
});
