import CustomComponent from "./CustomComponent";

describe("CustomComponent", () => {
    it("should set all properties when provided", () => {
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
            format: "text",
            enableLinks: true
        };
        const component = new CustomComponent(props);

        expect(component.tagName).toBe(props.tagName);
        expect(component.inline).toBe(props.inline);
        expect(component.hideTitle).toBe(props.hideTitle);
        expect(component.size).toBe(props.size);
        expect(component.hideIfEmpty).toBe(props.hideIfEmpty);
        expect(component.styleOverride).toBe(props.styleOverride);
        expect(component.isChildComponent).toBe(props.isChildComponent);
        expect(component.feedbackType).toBe(props.feedbackType);
        expect(component.hideOrgNr).toBe(props.hideOrgNr);
        expect(component.format).toBe(props.format);
        expect(component.enableLinks).toBe(props.enableLinks);
    });

    it("should not set properties that are not provided", () => {
        const props = {};
        const component = new CustomComponent(props);

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
        expect(component.enableLinks).toBeUndefined();
    });

    it("should only set provided properties", () => {
        const props = { tagName: "x", inline: false, size: "small" };
        const component = new CustomComponent(props);

        expect(component.tagName).toBe("x");
        expect(component.inline).toBeUndefined();
        expect(component.size).toBe("small");
        expect(component.hideTitle).toBeUndefined();
        expect(component.hideIfEmpty).toBeUndefined();
        expect(component.styleOverride).toBeUndefined();
        expect(component.isChildComponent).toBeUndefined();
        expect(component.feedbackType).toBeUndefined();
        expect(component.hideOrgNr).toBeUndefined();
        expect(component.format).toBeUndefined();
        expect(component.enableLinks).toBeUndefined();
    });

    it("should not set properties if falsy (except for string/objects)", () => {
        const props = {
            tagName: "", // falsy string
            inline: false, // falsy boolean
            hideTitle: false,
            size: "", // falsy string
            hideIfEmpty: false,
            styleOverride: null, // falsy object
            isChildComponent: false,
            feedbackType: "", // falsy string
            hideOrgNr: false,
            format: "", // falsy string
            enableLinks: false
        };
        const component = new CustomComponent(props);

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
        expect(component.enableLinks).toBeUndefined();
    });

    it("should not throw if props is undefined or null", () => {
        expect(() => new CustomComponent()).not.toThrow();
        expect(() => new CustomComponent(null)).not.toThrow();
        expect(() => new CustomComponent(undefined)).not.toThrow();
    });
});
