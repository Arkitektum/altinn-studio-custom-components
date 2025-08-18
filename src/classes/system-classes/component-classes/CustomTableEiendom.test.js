import CustomTableEiendom from "./CustomTableEiendom";

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
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    hasValue
} = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomTableEiendom", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is empty", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const props = { resourceBindings: { emptyFieldText: "emptyTextKey" } };
            const instance = new CustomTableEiendom(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toBe(false);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.data).toBe("Empty");
        });

        it("should set resourceValues.data to data when not empty", () => {
            getComponentDataValue.mockReturnValue([{ foo: "bar" }]);
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("ShouldNotBeUsed");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const props = {};
            const instance = new CustomTableEiendom(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual(expect.any(Array));
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getEiendomListFromData", () => {
            const props = {};
            getComponentDataValue.mockReturnValue([{ foo: "bar" }]);
            const instance = new CustomTableEiendom(props);
            const spy = jest.spyOn(instance, "getEiendomListFromData");
            instance.getValueFromFormData(props);
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("getEiendomListFromData", () => {
        it("should return undefined if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableEiendom({});
            expect(instance.getEiendomListFromData(undefined)).toBeUndefined();
        });

        it("should return filtered Eiendom instances", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasEiendomValue").mockImplementation((e) => e.valid);
            const data = [{ valid: true }, { valid: false }];
            const result = instance.getEiendomListFromData(data);
            expect(result.length).toBe(1);
            expect(result[0].valid).toBe(true);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            global.window = { textResources: ["foo"] };
            hasMissingTextResources.mockReturnValue(true);
            const instance = new CustomTableEiendom({});
            expect(instance.getValidationMessages({})).toBe(true);
            delete global.window;
        });

        it("should call hasMissingTextResources with empty array if window.textResources is undefined", () => {
            global.window = {};
            hasMissingTextResources.mockReturnValue(false);
            const instance = new CustomTableEiendom({});
            expect(instance.getValidationMessages({})).toBe(false);
            delete global.window;
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableEiendom({});
            expect(instance.hasContent("data")).toBe(true);
            hasValue.mockReturnValue(false);
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("hasZipCodeOrCity", () => {
        it("should return true if postnr or poststed has value", () => {
            hasValue.mockImplementation((v) => !!v);
            const instance = new CustomTableEiendom({});
            expect(instance.hasZipCodeOrCity({ adresse: { postnr: "1234" } })).toBe(true);
            expect(instance.hasZipCodeOrCity({ adresse: { poststed: "Oslo" } })).toBe(true);
            expect(instance.hasZipCodeOrCity({ adresse: {} })).toBe(false);
        });
    });

    describe("hasAdresseLinje", () => {
        it("should return true if any address line has value", () => {
            hasValue.mockImplementation((v) => !!v);
            const instance = new CustomTableEiendom({});
            expect(instance.hasAdresseLinje({ adresse: { adresselinje1: "A" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: { adresselinje2: "B" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: { adresselinje3: "C" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: {} })).toBe(false);
        });
    });

    describe("hasAdresse", () => {
        it("should return true if hasAdresseLinje or hasZipCodeOrCity is true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresseLinje").mockReturnValue(false);
            jest.spyOn(instance, "hasZipCodeOrCity").mockReturnValue(true);
            expect(instance.hasAdresse({})).toBe(true);

            instance.hasAdresseLinje.mockReturnValue(true);
            instance.hasZipCodeOrCity.mockReturnValue(false);
            expect(instance.hasAdresse({})).toBe(true);

            instance.hasAdresseLinje.mockReturnValue(false);
            instance.hasZipCodeOrCity.mockReturnValue(false);
            expect(instance.hasAdresse({})).toBe(false);
        });
    });

    describe("hasEiendomNummerField", () => {
        it("should return true if any property number field has value", () => {
            hasValue.mockImplementation((v) => !!v);
            const instance = new CustomTableEiendom({});
            expect(instance.hasEiendomNummerField({ bolignummer: "1" })).toBe(true);
            expect(instance.hasEiendomNummerField({ bygningsnummer: "2" })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { gaardsnummer: "3" } })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { bruksnummer: "4" } })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { seksjonsnummer: "5" } })).toBe(true);
            expect(instance.hasEiendomNummerField({ eiendomsidentifikasjon: { festenummer: "6" } })).toBe(true);
            expect(instance.hasEiendomNummerField({})).toBe(false);
        });
    });

    describe("hasEiendomValue", () => {
        it("should return true if hasAdresse or hasEiendomNummerField is true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresse").mockReturnValue(true);
            jest.spyOn(instance, "hasEiendomNummerField").mockReturnValue(false);
            expect(instance.hasEiendomValue({})).toBe(true);

            instance.hasAdresse.mockReturnValue(false);
            instance.hasEiendomNummerField.mockReturnValue(true);
            expect(instance.hasEiendomValue({})).toBe(true);

            instance.hasAdresse.mockReturnValue(false);
            instance.hasEiendomNummerField.mockReturnValue(false);
            expect(instance.hasEiendomValue({})).toBe(false);
        });
    });

    describe("getTextResourceBindings", () => {
        it("should return default bindings if none provided", () => {
            const instance = new CustomTableEiendom({});
            const result = instance.getTextResourceBindings({});
            expect(result.adresse.title).toBe("resource.eiendomByggested.eiendom.adresse.title");
            expect(result.adresse.emptyFieldText).toBe("resource.eiendomByggested.eiendom.adresse.emptyFieldText");
            expect(result.eiendomByggested.title).toBe("resource.eiendomByggested.eiendom.title");
            expect(result.eiendomByggested.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use custom bindings if provided", () => {
            const props = {
                resourceBindings: {
                    adresse: { title: "customAdresse", emptyFieldText: "customEmpty" },
                    title: "customTitle",
                    emptyFieldText: "customEmptyFieldText"
                }
            };
            const instance = new CustomTableEiendom(props);
            const result = instance.getTextResourceBindings(props);
            expect(result.adresse.title).toBe("customAdresse");
            expect(result.adresse.emptyFieldText).toBe("customEmpty");
            expect(result.eiendomByggested.title).toBe("customTitle");
            expect(result.eiendomByggested.emptyFieldText).toBe("customEmptyFieldText");
        });

        it("should omit title and/or emptyFieldText if hideTitle/hideIfEmpty is true", () => {
            const props = {
                hideTitle: true,
                hideIfEmpty: true,
                resourceBindings: {}
            };
            const instance = new CustomTableEiendom(props);
            const result = instance.getTextResourceBindings(props);
            expect(result.eiendomByggested).toBeUndefined();
        });

        it('should omit title and/or emptyFieldText if hideTitle/hideIfEmpty is "true"', () => {
            const props = {
                hideTitle: "true",
                hideIfEmpty: "true",
                resourceBindings: {}
            };
            const instance = new CustomTableEiendom(props);
            const result = instance.getTextResourceBindings(props);
            expect(result.eiendomByggested).toBeUndefined();
        });
    });
});
