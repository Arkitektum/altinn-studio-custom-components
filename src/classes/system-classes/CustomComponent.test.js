import CustomComponent from "./CustomComponent";

describe("CustomComponent", () => {
    let mockElement;

    beforeEach(() => {
        mockElement = document.createElement("div");
    });

    it("should initialize with valid formData", () => {
        mockElement.setAttribute("formdata", JSON.stringify({ key: "value" }));
        const component = new CustomComponent(mockElement);
        expect(component.formData).toEqual({ key: "value" });
    });

    it("should initialize with valid text", () => {
        mockElement.setAttribute("text", "Sample Text");
        const component = new CustomComponent(mockElement);
        expect(component.text).toBe("Sample Text");
    });

    it("should initialize with valid texts", () => {
        mockElement.setAttribute("texts", JSON.stringify({ title: "Title" }));
        const component = new CustomComponent(mockElement);
        expect(component.texts).toEqual({ title: "Title" });
    });

    it("should initialize with inline set to true", () => {
        mockElement.setAttribute("inline", "true");
        const component = new CustomComponent(mockElement);
        expect(component.inline).toBe(true);
    });

    it("should initialize with hideTitle set to true", () => {
        mockElement.setAttribute("hideTitle", "true");
        const component = new CustomComponent(mockElement);
        expect(component.hideTitle).toBe(true);
    });

    it("should initialize with valid size", () => {
        mockElement.setAttribute("size", "h1");
        const component = new CustomComponent(mockElement);
        expect(component.size).toBe("h1");
    });

    it("should initialize with hideIfEmpty set to true", () => {
        mockElement.setAttribute("hideIfEmpty", "true");
        const component = new CustomComponent(mockElement);
        expect(component.hideIfEmpty).toBe(true);
    });

    it("should initialize with valid styleOverride", () => {
        mockElement.setAttribute("styleOverride", JSON.stringify({ color: "red" }));
        const component = new CustomComponent(mockElement);
        expect(component.styleOverride).toEqual({ color: "red" });
    });

    it("should initialize with isChildComponent set to true", () => {
        mockElement.setAttribute("isChildComponent", "true");
        const component = new CustomComponent(mockElement);
        expect(component.isChildComponent).toBe(true);
    });

    it("should initialize with valid feedbackType", () => {
        mockElement.setAttribute("feedbackType", "error");
        const component = new CustomComponent(mockElement);
        expect(component.feedbackType).toBe("error");
    });

    it("should initialize with valid itemKey", () => {
        mockElement.setAttribute("itemKey", "uniqueKey");
        const component = new CustomComponent(mockElement);
        expect(component.itemKey).toBe("uniqueKey");
    });

    it("should initialize with hideOrgNr set to true", () => {
        mockElement.setAttribute("hideOrgNr", "true");
        const component = new CustomComponent(mockElement);
        expect(component.hideOrgNr).toBe(true);
    });

    it("should initialize with valid format", () => {
        mockElement.setAttribute("format", "json");
        const component = new CustomComponent(mockElement);
        expect(component.format).toBe("json");
    });

    it("should initialize with showRowNumbers set to true", () => {
        mockElement.setAttribute("showRowNumbers", "true");
        const component = new CustomComponent(mockElement);
        expect(component.showRowNumbers).toBe(true);
    });

    it("should set formData using setFormData method", () => {
        const component = new CustomComponent(mockElement);
        component.setFormData({ key: "newValue" });
        expect(component.formData).toEqual({ key: "newValue" });
    });

    it("should set texts using setTexts method", () => {
        const component = new CustomComponent(mockElement);
        component.setTexts({ title: "New Title" });
        expect(component.texts).toEqual({ title: "New Title" });
    });

    it("should set text using setText method", () => {
        const component = new CustomComponent(mockElement);
        component.setText("New Text");
        expect(component.text).toBe("New Text");
    });
});
