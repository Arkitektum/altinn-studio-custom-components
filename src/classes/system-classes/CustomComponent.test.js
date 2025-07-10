import CustomComponent from "./CustomComponent";

describe("CustomComponent", () => {
    it("should initialize properties from props", () => {
        const props = {
            tagName: "custom-tag",
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

    it("should not throw if props is undefined", () => {
        expect(() => new CustomComponent()).not.toThrow();
    });
});
