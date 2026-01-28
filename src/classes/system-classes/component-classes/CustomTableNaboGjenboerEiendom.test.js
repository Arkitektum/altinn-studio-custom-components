import CustomTableNaboGjenboerEiendom from "./CustomTableNaboGjenboerEiendom";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Eiendom.js", () => {
    return function Eiendom(data) {
        Object.assign(this, data);
    };
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props.formData),
    getTextResourceFromResourceBinding: jest.fn((key) => `text-for-${key}`),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => ["missing-resource"]),
    hasValidationMessages: jest.fn((messages) => messages && messages.length > 0)
}));

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomTableNaboGjenboerEiendom", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("sets isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is empty", () => {
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue(undefined);
            getTextResourceFromResourceBinding.mockReturnValue("empty");
            hasValidationMessages.mockReturnValue(true);

            const props = { formData: undefined, resourceBindings: {} };
            const instance = new CustomTableNaboGjenboerEiendom(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toEqual(["missing-resource"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.data).toContain("empty");
        });

        it("sets resourceValues.data to data when not empty", () => {
            hasValue.mockReturnValue(true);
            getComponentDataValue.mockReturnValue([{ matrikkelinformasjon: { kommunenavn: "Oslo" } }]);
            const props = { formData: [{ matrikkelinformasjon: { kommunenavn: "Oslo" } }], resourceBindings: {} };
            const instance = new CustomTableNaboGjenboerEiendom(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toBeInstanceOf(Array);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns list of Eiendom objects from formData", () => {
            hasValue.mockReturnValue(true);
            const props = { formData: [{ matrikkelinformasjon: { kommunenavn: "Oslo" } }] };
            const instance = new CustomTableNaboGjenboerEiendom(props);
            const result = instance.getValueFromFormData(props);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0].kommunenavn).toBe("Oslo");
        });

        it("returns undefined if formData is not valid", () => {
            hasValue.mockReturnValue(false);
            const props = { formData: undefined };
            const instance = new CustomTableNaboGjenboerEiendom(props);
            const result = instance.getValueFromFormData(props);

            expect(result).toBeUndefined();
        });
    });

    describe("getEiendomListFromData", () => {
        it("returns filtered Eiendom objects", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasEiendomValue = jest.fn(() => true);

            const data = [{ matrikkelinformasjon: { kommunenavn: "Oslo" } }];
            const result = instance.getEiendomListFromData(data);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0].kommunenavn).toBe("Oslo");
        });

        it("returns undefined if data is not valid", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableNaboGjenboerEiendom({});
            const result = instance.getEiendomListFromData(undefined);

            expect(result).toBeUndefined();
        });
    });

    describe("getValidationMessages", () => {
        it("returns missing text resources", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            const result = instance.getValidationMessages({});

            expect(result).toEqual(["missing-resource"]);
            expect(hasMissingTextResources).toHaveBeenCalled();
        });
    });

    describe("hasContent", () => {
        it("delegates to hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasContent("something")).toBe(true);
        });
    });

    describe("hasKommunenavn", () => {
        it("returns true if kommunenavn exists", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasKommunenavn({ kommunenavn: "Oslo" })).toBe(true);
        });

        it("returns false if kommunenavn does not exist", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasKommunenavn({})).toBe(false);
        });
    });

    describe("hasZipCodeOrCity", () => {
        it("returns true if postnr exists", () => {
            hasValue.mockImplementation((val) => val === "1234");
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasZipCodeOrCity({ adresse: { postnr: "1234" } })).toBe(true);
        });

        it("returns true if poststed exists", () => {
            hasValue.mockImplementation((val) => val === "Oslo");
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasZipCodeOrCity({ adresse: { poststed: "Oslo" } })).toBe(true);
        });

        it("returns false if neither exists", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasZipCodeOrCity({ adresse: {} })).toBe(false);
        });
    });

    describe("hasAdresseLinje", () => {
        it("returns true if any address line exists", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasAdresseLinje({ adresse: { adresselinje1: "A", adresselinje2: "", adresselinje3: "" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: { adresselinje2: "B" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: { adresselinje3: "C" } })).toBe(true);
        });

        it("returns false if no address lines exist", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasAdresseLinje({ adresse: {} })).toBe(false);
        });
    });

    describe("hasAdresse", () => {
        it("returns true if hasAdresseLinje returns true", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresseLinje = jest.fn(() => true);
            instance.hasZipCodeOrCity = jest.fn(() => false);
            instance.hasKommunenavn = jest.fn(() => false);
            expect(instance.hasAdresse({})).toBe(true);
        });

        it("returns true if hasZipCodeOrCity returns true", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresseLinje = jest.fn(() => false);
            instance.hasZipCodeOrCity = jest.fn(() => true);
            instance.hasKommunenavn = jest.fn(() => false);
            expect(instance.hasAdresse({})).toBe(true);
        });

        it("returns true if hasKommunenavn returns true", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresseLinje = jest.fn(() => false);
            instance.hasZipCodeOrCity = jest.fn(() => false);
            instance.hasKommunenavn = jest.fn(() => true);
            expect(instance.hasAdresse({})).toBe(true);
        });

        it("returns false if none return true", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresseLinje = jest.fn(() => false);
            instance.hasZipCodeOrCity = jest.fn(() => false);
            instance.hasKommunenavn = jest.fn(() => false);
            expect(instance.hasAdresse({})).toBe(false);
        });
    });

    describe("hasEiendomNummerField", () => {
        it("returns true if any field exists", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasEiendomNummerField({ bolignummer: "1" })).toBe(true);
            expect(instance.hasEiendomNummerField({ bygningsnummer: "2" })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { gaardsnummer: "3" } })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { bruksnummer: "4" } })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { seksjonsnummer: "5" } })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { festenummer: "6" } })).toBe(true);
        });

        it("returns false if none exist", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableNaboGjenboerEiendom({});
            expect(instance.hasEiendomNummerField({})).toBe(false);
        });
    });

    describe("hasEiendomValue", () => {
        it("returns true if hasAdresse returns true", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresse = jest.fn(() => true);
            instance.hasEiendomNummerField = jest.fn(() => false);
            expect(instance.hasEiendomValue({})).toBe(true);
        });

        it("returns true if hasEiendomNummerField returns true", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresse = jest.fn(() => false);
            instance.hasEiendomNummerField = jest.fn(() => true);
            expect(instance.hasEiendomValue({})).toBe(true);
        });

        it("returns false if both return false", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            instance.hasAdresse = jest.fn(() => false);
            instance.hasEiendomNummerField = jest.fn(() => false);
            expect(instance.hasEiendomValue({})).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("returns default resource bindings when no props provided", () => {
            const instance = new CustomTableNaboGjenboerEiendom({});
            const result = instance.getResourceBindings({});
            expect(result.adresse.title).toContain("resource.eiendom");
            expect(result.eiendomByggested.title).toContain("resource.naboGjenboer");
            expect(result.eiendomByggested.emptyFieldText).toContain("resource.emptyFieldText.default");
        });

        it("uses custom resource bindings from props", () => {
            const props = {
                resourceBindings: {
                    adresse: { title: "custom-title", emptyFieldText: "custom-empty" },
                    title: "custom-main-title",
                    emptyFieldText: "custom-main-empty"
                }
            };
            const instance = new CustomTableNaboGjenboerEiendom(props);
            const result = instance.getResourceBindings(props);
            expect(result.adresse.title).toBe("custom-title");
            expect(result.adresse.emptyFieldText).toBe("custom-empty");
            expect(result.eiendomByggested.title).toBe("custom-main-title");
            expect(result.eiendomByggested.emptyFieldText).toBe("custom-main-empty");
        });

        it("omits title and/or emptyFieldText if hideTitle/hideIfEmpty is true", () => {
            const props = {
                hideTitle: true,
                hideIfEmpty: true,
                resourceBindings: {}
            };
            const instance = new CustomTableNaboGjenboerEiendom(props);
            const result = instance.getResourceBindings(props);
            expect(result.eiendomByggested).toBeUndefined();
        });
    });
});
