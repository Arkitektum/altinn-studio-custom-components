import CustomFieldProsjekt from "./CustomFieldProsjekt";
import { getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Prosjekt.js", () => {
    return function Prosjekt(data) {
        return data;
    };
});
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((key) => `resource:${key}`),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));

describe("CustomFieldProsjekt", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("sets isEmpty to true if props.isEmpty is true", () => {
            const props = {
                isEmpty: true,
                resourceBindings: { title: "titleKey", emptyFieldText: "emptyKey" },
                formData: { data: { prosjektnavn: "Navn", prosjektnr: 123 } }
            };
            const instance = new CustomFieldProsjekt(props);
            expect(instance.isEmpty).toBe(true);
            expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("titleKey");
            expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("emptyKey");
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toBe("resource:emptyKey");
        });

        it("sets isEmpty to false if formDataValue has content and props.isEmpty is undefined", () => {
            hasValue.mockReturnValueOnce(true);
            const props = {
                resourceBindings: { title: "titleKey", emptyFieldText: "emptyKey" },
                formData: { data: { prosjektnavn: "Navn", prosjektnr: 123 } }
            };
            const instance = new CustomFieldProsjekt(props);
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toContain("Navn");
            expect(instance.resourceValues.data).toContain("123");
        });

        it("sets isEmpty to true if formDataValue has no content and props.isEmpty is undefined", () => {
            hasValue.mockReturnValueOnce(false);
            const props = {
                resourceBindings: { title: "titleKey", emptyFieldText: "emptyKey" },
                formData: { data: {} }
            };
            const instance = new CustomFieldProsjekt(props);
            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("resource:emptyKey");
        });
    });

    describe("hasContent", () => {
        it("returns true for non-empty value", () => {
            hasValue.mockReturnValueOnce(true);
            const instance = new CustomFieldProsjekt({});
            expect(instance.hasContent("abc")).toBe(true);
        });

        it("returns false for empty value", () => {
            hasValue.mockReturnValueOnce(false);
            const instance = new CustomFieldProsjekt({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("formatProsjekt", () => {
        it("formats prosjekt with name and number", () => {
            hasValue.mockReturnValueOnce(true);
            const instance = new CustomFieldProsjekt({});
            const result = instance.formatProsjekt({ prosjektnavn: "Navn", prosjektnr: 123 });
            expect(result).toBe("Navn (123)");
        });

        it("formats prosjekt with only name", () => {
            hasValue.mockReturnValueOnce(false);
            const instance = new CustomFieldProsjekt({});
            const result = instance.formatProsjekt({ prosjektnavn: "Navn" });
            expect(result).toBe("Navn");
        });

        it("formats prosjekt with only number", () => {
            hasValue.mockReturnValueOnce(true);
            const instance = new CustomFieldProsjekt({});
            const result = instance.formatProsjekt({ prosjektnr: 123 });
            expect(result).toBe("(123)");
        });

        it("returns empty string if no name or number", () => {
            hasValue.mockReturnValueOnce(false);
            const instance = new CustomFieldProsjekt({});
            const result = instance.formatProsjekt({});
            expect(result).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("returns formatted prosjekt from props.formData.data", () => {
            const instance = new CustomFieldProsjekt({});
            instance.formatProsjekt = jest.fn().mockReturnValue("formatted");
            const props = { formData: { data: { prosjektnavn: "Navn", prosjektnr: 123 } } };
            const result = instance.getValueFromFormData(props);
            expect(instance.formatProsjekt).toHaveBeenCalledWith({ prosjektnavn: "Navn", prosjektnr: 123 });
            expect(result).toBe("formatted");
        });
    });
});
