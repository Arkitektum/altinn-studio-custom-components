import CustomComponent from "./CustomComponent";

describe("CustomComponent", () => {
    it("should initialize properties from props", () => {
        const props = {
            tagName: "custom-tag",
            text: "Hello",
            texts: { label: "Label" },
            inline: true,
            hideTitle: true,
            size: "large",
            hideIfEmpty: true,
            styleOverride: { color: "red" },
            isChildComponent: true,
            feedbackType: "info",
            hideOrgNr: true,
            format: "uppercase"
        };
        const component = new CustomComponent(props);

        expect(component.tagName).toBe("custom-tag");
        expect(component.text).toBe("Hello");
        expect(component.texts).toEqual({ label: "Label" });
        expect(component.inline).toBe(true);
        expect(component.hideTitle).toBe(true);
        expect(component.size).toBe("large");
        expect(component.hideIfEmpty).toBe(true);
        expect(component.styleOverride).toEqual({ color: "red" });
        expect(component.isChildComponent).toBe(true);
        expect(component.feedbackType).toBe("info");
        expect(component.hideOrgNr).toBe(true);
        expect(component.format).toBe("uppercase");
    });

    it("should not set properties if not provided", () => {
        const component = new CustomComponent({});
        expect(component.tagName).toBeUndefined();
        expect(component.text).toBeUndefined();
        expect(component.texts).toBeUndefined();
        expect(component.inline).toBeUndefined();
        expect(component.hideTitle).toBeUndefined();
        expect(component.size).toBeUndefined();
        expect(component.hideIfEmpty).toBeUndefined();
        expect(component.styleOverride).toBeUndefined();
        expect(component.isChildComponent).toBeUndefined();
        expect(component.feedbackType).toBeUndefined();
        expect(component.hideOrgNr).toBeUndefined();
        expect(component.format).toBeUndefined();
    });

    it("should set formData using setFormData", () => {
        const component = new CustomComponent({});
        const formData = { field: "value" };
        component.setFormData(formData);
        expect(component.formData).toEqual(formData);
    });

    it("should set texts using setTexts", () => {
        const component = new CustomComponent({});
        const texts = { label: "Test" };
        component.setTexts(texts);
        expect(component.texts).toEqual(texts);
    });

    it("should set text using setText", () => {
        const component = new CustomComponent({});
        component.setText("New text");
        expect(component.text).toBe("New text");
    });

    it("should not throw if props is undefined", () => {
        expect(() => new CustomComponent()).not.toThrow();
    });
});
