import CustomElementHtmlAttributes from "./CustomElementHtmlAttributes";

describe("CustomElementHtmlAttributes", () => {
    describe("constructor", () => {
        it("should initialize properties correctly when valid props are provided", () => {
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
                format: "json"
            };

            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.formData).toBe(JSON.stringify(props.formData));
            expect(instance.text).toBe(props.text);
            expect(instance.size).toBe(props.size);
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
        });

        it("should handle missing or invalid props gracefully", () => {
            const props = {};
            const instance = new CustomElementHtmlAttributes(props);

            expect(instance.formData).toBeUndefined();
            expect(instance.text).toBeUndefined();
            expect(instance.size).toBeUndefined();
            expect(instance.hideTitle).toBeUndefined();
            expect(instance.hideIfEmpty).toBeUndefined();
            expect(instance.inline).toBeUndefined();
            expect(instance.emptyFieldText).toBeUndefined();
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
        });
    });

    describe("getFormDataAttributeFromProps", () => {
        it("should return JSON string for valid formData", () => {
            const props = { formData: { key: "value" } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFormDataAttributeFromProps(props)).toBe(JSON.stringify(props.formData));
        });

        it("should return null for invalid formData", () => {
            const props = { formData: null };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFormDataAttributeFromProps(props)).toBeNull();
        });

        it("should return a JSON stringified value when formData type is a string", () => {
            const props = { formData: "value" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFormDataAttributeFromProps(props)).toBe(JSON.stringify(props.formData));
        });

        it("should return a JSON stringified value when formData is a number", () => {
            const props = { formData: 123 };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFormDataAttributeFromProps(props)).toBe(JSON.stringify(props.formData.toString()));
        });
    });

    describe("getTextAttributeFromProps", () => {
        it("should return text if hideTitle is false", () => {
            const props = { text: "Sample Text", hideTitle: false };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getTextAttributeFromProps(props)).toBe("Sample Text");
        });

        it("should return empty string if hideTitle is true", () => {
            const props = { text: "Sample Text", hideTitle: true };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getTextAttributeFromProps(props)).toBe("");
        });
    });

    describe("getSizeAttributeFromProps", () => {
        it("should return size as string if valid", () => {
            const props = { size: "h3" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getSizeAttributeFromProps(props)).toBe("h3");
        });

        it("should return undefined if size is invalid", () => {
            const props = { size: null };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getSizeAttributeFromProps(props)).toBeUndefined();
        });
    });

    describe("getFeedbackTypeAttributeFromProps", () => {
        it("should return valid feedbackType", () => {
            const props = { feedbackType: "error" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFeedbackTypeAttributeFromProps(props)).toBe("error");
        });

        it('should return "default" for invalid feedbackType', () => {
            const props = { feedbackType: "invalid" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFeedbackTypeAttributeFromProps(props)).toBe("default");
        });

        it("should return null if feedbackType is not provided", () => {
            const props = {};
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getFeedbackTypeAttributeFromProps(props)).toBeNull();
        });
    });

    describe("getHideOrgNr", () => {
        it('should return "true" if hideOrgNr is true', () => {
            const props = { hideOrgNr: true };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getHideOrgNr(props)).toBe("true");
        });

        it("should return undefined if hideOrgNr is false", () => {
            const props = { hideOrgNr: false };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.getHideOrgNr(props)).toBeUndefined();
        });

        it('should set isChildComponent to "true" by default', () => {
            const props = {};
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.isChildComponent).toBe("true");
        });

        it("should set formData correctly when provided", () => {
            const props = { formData: { key: "value" } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.formData).toBe(JSON.stringify(props.formData));
        });

        it("should set text correctly when provided", () => {
            const props = { text: "Sample Text" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.text).toBe(props.text);
        });

        it("should set size correctly when provided", () => {
            const props = { size: "h1" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.size).toBe(props.size);
        });

        it("should set hideTitle correctly when provided", () => {
            const props = { hideTitle: true };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.hideTitle).toBe("true");
        });

        it("should set hideIfEmpty correctly when provided", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.hideIfEmpty).toBe("true");
        });

        it("should set inline correctly when provided", () => {
            const props = { inline: true };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.inline).toBe("true");
        });

        it("should set emptyFieldText correctly when provided", () => {
            const props = { texts: { emptyFieldText: "Empty Field" } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.texts).toBe(JSON.stringify(props.texts));
        });

        it("should set styleOverride correctly when provided", () => {
            const props = { styleOverride: { color: "red" } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.styleOverride).toBe(JSON.stringify(props.styleOverride));
        });

        it("should set grid correctly when provided", () => {
            const props = { grid: { xs: 6 } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.grid).toBe(JSON.stringify(props.grid));
        });

        it("should set texts correctly when provided", () => {
            const props = { texts: { title: "Title" } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.texts).toBe(JSON.stringify(props.texts));
        });

        it("should set tableColumns correctly when provided", () => {
            const props = { tableColumns: [{ name: "Column1" }] };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.tableColumns).toBe(JSON.stringify(props.tableColumns));
        });

        it("should set textResources correctly when provided", () => {
            const props = { textResources: { key: "value" } };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.textResources).toBe(JSON.stringify(props.textResources));
        });

        it("should set itemKey correctly when provided", () => {
            const props = { itemKey: "item-1" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.itemKey).toBe(props.itemKey);
        });

        it("should set id correctly when provided", () => {
            const props = { id: "component-1" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.id).toBe(props.id);
        });

        it("should set feedbackType correctly when provided", () => {
            const props = { feedbackType: "success" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.feedbackType).toBe(props.feedbackType);
        });

        it("should set hideOrgNr correctly when provided", () => {
            const props = { hideOrgNr: true };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.hideOrgNr).toBe("true");
        });

        it("should set format correctly when provided", () => {
            const props = { format: "json" };
            const instance = new CustomElementHtmlAttributes(props);
            expect(instance.format).toBe(props.format);
        });
    });
});
