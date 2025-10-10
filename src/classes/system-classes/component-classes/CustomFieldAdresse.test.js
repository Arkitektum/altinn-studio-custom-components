import CustomFieldAdresse from "./CustomFieldAdresse";

// Mock helpers and validations
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const { getComponentDataValue, getComponentResourceValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomFieldAdresse", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set validationMessages, hasValidationMessages, isEmpty, and resourceValues", () => {
            getComponentDataValue.mockReturnValue({ adresselinje1: "A", postnr: "1234", poststed: "Oslo" });
            getComponentResourceValue.mockReturnValue("Adresse");
            getTextResourceFromResourceBinding.mockReturnValue("Tom adresse");
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(["Missing"]);
            hasValidationMessages.mockReturnValue(true);

            const props = {
                resourceBindings: { title: "custom.title", emptyFieldText: "custom.empty" }
            };
            const instance = new CustomFieldAdresse(props);

            expect(instance.validationMessages).toEqual(["Missing"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("Adresse");
            expect(instance.resourceValues.data).not.toBe("Tom adresse");
        });

        it("should set isEmpty true and use emptyFieldText when no content", () => {
            getComponentDataValue.mockReturnValue({});
            getComponentResourceValue.mockReturnValue("Adresse");
            getTextResourceFromResourceBinding.mockReturnValue("Tom adresse");
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            const props = {
                resourceBindings: { title: "custom.title", emptyFieldText: "custom.empty" }
            };
            const instance = new CustomFieldAdresse(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Tom adresse");
        });
    });

    describe("formatAdresselinje", () => {
        it("should format address lines with newlines", () => {
            const adresse = { adresselinje1: "A", adresselinje2: "B", adresselinje3: "C" };
            const instance = new CustomFieldAdresse({});
            expect(instance.formatAdresselinje(adresse)).toBe("A\nB\nC");
        });

        it("should skip empty address lines", () => {
            const adresse = { adresselinje1: "A", adresselinje2: "", adresselinje3: "C" };
            const instance = new CustomFieldAdresse({});
            expect(instance.formatAdresselinje(adresse)).toBe("A\nC");
        });
    });

    describe("formatZipCity", () => {
        it("should format zip and city with space", () => {
            const adresse = { postnr: "1234", poststed: "Oslo" };
            const instance = new CustomFieldAdresse({});
            expect(instance.formatZipCity(adresse)).toBe("1234 Oslo");
        });

        it("should skip empty zip/city", () => {
            const adresse = { postnr: "", poststed: "Oslo" };
            const instance = new CustomFieldAdresse({});
            expect(instance.formatZipCity(adresse)).toBe("Oslo");
        });
    });

    describe("formatKommunenavn", () => {
        it("should return kommunenavn if present", () => {
            const adresse = { kommunenavn: "Oslo" };
            const instance = new CustomFieldAdresse({});
            expect(instance.formatKommunenavn(adresse)).toBe("Oslo");
        });

        it("should return empty string if kommunenavn missing", () => {
            const adresse = {};
            const instance = new CustomFieldAdresse({});
            expect(instance.formatKommunenavn(adresse)).toBe("");
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and bindings", () => {
            global.window = { textResources: ["a", "b"] };
            hasMissingTextResources.mockReturnValue(["missing"]);
            const instance = new CustomFieldAdresse({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith([], {
                adresse: { emptyFieldText: "resource.adresse.emptyFieldText.default", title: "resource.adresse.title" }
            });
            expect(result).toEqual(["missing"]);
        });

        it("should use empty array if window.textResources is undefined", () => {
            global.window = {};
            hasMissingTextResources.mockReturnValue([]);
            const instance = new CustomFieldAdresse({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith([], { foo: "bar" });
            expect(result).toEqual([]);
        });
    });

    describe("formatAdresse", () => {
        it("should format full address", () => {
            const adresse = { adresselinje1: "A", postnr: "1234", poststed: "Oslo" };
            getTextResourceFromResourceBinding.mockReturnValue("Tom adresse");
            const instance = new CustomFieldAdresse({});
            const result = instance.formatAdresse(adresse, { emptyFieldText: "empty" });
            expect(result).toBe("A\n1234 Oslo");
        });

        it("should format only address line", () => {
            const adresse = { adresselinje1: "A" };
            getTextResourceFromResourceBinding.mockReturnValue("Tom adresse");
            const instance = new CustomFieldAdresse({});
            const result = instance.formatAdresse(adresse, { emptyFieldText: "empty" });
            expect(result).toBe("A");
        });

        it("should format only zip/city", () => {
            const adresse = { postnr: "1234", poststed: "Oslo" };
            getTextResourceFromResourceBinding.mockReturnValue("Tom adresse");
            const instance = new CustomFieldAdresse({});
            const result = instance.formatAdresse(adresse, { emptyFieldText: "empty" });
            expect(result).toBe("1234 Oslo");
        });

        it("should format kommunenavn with emptyFieldText", () => {
            const adresse = { kommunenavn: "Oslo" };
            getTextResourceFromResourceBinding.mockReturnValue("Tom adresse");
            const instance = new CustomFieldAdresse({});
            const result = instance.formatAdresse(adresse, { emptyFieldText: "empty" });
            expect(result).toBe("Tom adresse\nOslo");
        });

        it("should return empty string if no address info", () => {
            const adresse = {};
            getTextResourceFromResourceBinding.mockReturnValue("");
            const instance = new CustomFieldAdresse({});
            const result = instance.formatAdresse(adresse, { emptyFieldText: "empty" });
            expect(result).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("should get value from form data and format address", () => {
            getComponentDataValue.mockReturnValue({ adresselinje1: "A", postnr: "1234", poststed: "Oslo" });
            const instance = new CustomFieldAdresse({});
            instance.formatAdresse = jest.fn().mockReturnValue("A\n1234 Oslo");
            const result = instance.getValueFromFormData({}, {});
            expect(result).toBe("A\n1234 Oslo");
            expect(instance.formatAdresse).toHaveBeenCalled();
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomFieldAdresse({});
            expect(instance.hasContent("data")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("data");
        });
    });

    describe("getTextResourceBindings", () => {
        it("should set title and emptyFieldText if not hidden", () => {
            const props = {
                hideTitle: false,
                hideIfTrue: false,
                resourceBindings: { title: "custom.title", emptyFieldText: "custom.empty" }
            };
            const instance = new CustomFieldAdresse({});
            const result = instance.getTextResourceBindings(props);
            expect(result.adresse.title).toBe("custom.title");
            expect(result.adresse.emptyFieldText).toBe("custom.empty");
        });

        it("should use default keys if not provided", () => {
            const props = { hideTitle: false };
            const instance = new CustomFieldAdresse({});
            const result = instance.getTextResourceBindings(props);
            expect(result.adresse.title).toBe("resource.adresse.title");
            expect(result.adresse.emptyFieldText).toBe("resource.adresse.emptyFieldText.default");
        });

        it("should not set title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomFieldAdresse({});
            const result = instance.getTextResourceBindings(props);
            expect(result.adresse.title).toBeUndefined();
        });

        it("should not set emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomFieldAdresse({});
            const result = instance.getTextResourceBindings(props);
            expect(result.adresse.emptyFieldText).toBeUndefined();
        });
    });
});
