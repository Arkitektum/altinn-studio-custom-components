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

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomTableEiendom", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is empty", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue("missing");
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("empty");

            const props = { resourceBindings: { eiendomByggested: { emptyFieldText: "emptyKey" } } };
            const instance = new CustomTableEiendom(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toBe("missing");
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.data).toBe("empty");
        });

        it("should set resourceValues.data to data when not empty", () => {
            getComponentDataValue.mockReturnValue([{ foo: "bar" }]);
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue("none");
            hasValidationMessages.mockReturnValue(false);

            // hasEiendomValue returns true for all Eiendom instances
            const instance = new CustomTableEiendom({});

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getEiendomListFromData", () => {
            getComponentDataValue.mockReturnValue([{ foo: "bar" }]);
            hasValue.mockReturnValue(true);

            const instance = new CustomTableEiendom({});
            const spy = jest.spyOn(instance, "getEiendomListFromData");
            instance.getValueFromFormData({});
            expect(getComponentDataValue).toHaveBeenCalled();
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
            jest.spyOn(instance, "hasEiendomValue").mockReturnValueOnce(true).mockReturnValueOnce(false);
            const result = instance.getEiendomListFromData([{ a: 1 }, { b: 2 }]);
            expect(result.length).toBe(1);
            expect(result[0].a).toBe(1);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            global.window = { textResources: ["foo"] };
            hasMissingTextResources.mockReturnValue("msg");
            const instance = new CustomTableEiendom({});
            expect(instance.getValidationMessages({})).toBe("msg");
        });

        it("should call hasMissingTextResources with empty array if window is undefined", () => {
            delete global.window;
            hasMissingTextResources.mockReturnValue("msg");
            const instance = new CustomTableEiendom({});
            expect(instance.getValidationMessages({})).toBe("msg");
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableEiendom({});
            expect(instance.hasContent("data")).toBe(true);
        });
    });

    describe("hasKommunenavn", () => {
        it("should return true if kommunenavn has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableEiendom({});
            expect(instance.hasKommunenavn({ kommunenavn: "Oslo" })).toBe(true);
        });
    });

    describe("hasZipCodeOrCity", () => {
        it("should return true if postnr has value", () => {
            hasValue.mockImplementation((v) => v === 1234);
            const instance = new CustomTableEiendom({});
            expect(instance.hasZipCodeOrCity({ adresse: { postnr: 1234 } })).toBe(true);
        });

        it("should return true if poststed has value", () => {
            hasValue.mockImplementation((v) => v === "Oslo");
            const instance = new CustomTableEiendom({});
            expect(instance.hasZipCodeOrCity({ adresse: { poststed: "Oslo" } })).toBe(true);
        });
    });

    describe("hasAdresseLinje", () => {
        it("should return true if any address line has value", () => {
            hasValue.mockImplementation((v) => !!v);
            const instance = new CustomTableEiendom({});
            expect(instance.hasAdresseLinje({ adresse: { adresselinje1: "A", adresselinje2: "", adresselinje3: "" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: { adresselinje1: "", adresselinje2: "B", adresselinje3: "" } })).toBe(true);
            expect(instance.hasAdresseLinje({ adresse: { adresselinje1: "", adresselinje2: "", adresselinje3: "C" } })).toBe(true);
        });
    });

    describe("hasAdresse", () => {
        it("should return true if hasAdresseLinje returns true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresseLinje").mockReturnValue(true);
            jest.spyOn(instance, "hasZipCodeOrCity").mockReturnValue(false);
            jest.spyOn(instance, "hasKommunenavn").mockReturnValue(false);
            expect(instance.hasAdresse({})).toBe(true);
        });

        it("should return true if hasZipCodeOrCity returns true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresseLinje").mockReturnValue(false);
            jest.spyOn(instance, "hasZipCodeOrCity").mockReturnValue(true);
            jest.spyOn(instance, "hasKommunenavn").mockReturnValue(false);
            expect(instance.hasAdresse({})).toBe(true);
        });

        it("should return true if hasKommunenavn returns true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresseLinje").mockReturnValue(false);
            jest.spyOn(instance, "hasZipCodeOrCity").mockReturnValue(false);
            jest.spyOn(instance, "hasKommunenavn").mockReturnValue(true);
            expect(instance.hasAdresse({})).toBe(true);
        });

        it("should return false if all checks return false", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresseLinje").mockReturnValue(false);
            jest.spyOn(instance, "hasZipCodeOrCity").mockReturnValue(false);
            jest.spyOn(instance, "hasKommunenavn").mockReturnValue(false);
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
        });

        it("should return false if no property number field has value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableEiendom({});
            expect(instance.hasEiendomNummerField({})).toBe(false);
        });
    });

    describe("hasEiendomValue", () => {
        it("should return true if hasAdresse returns true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresse").mockReturnValue(true);
            jest.spyOn(instance, "hasEiendomNummerField").mockReturnValue(false);
            expect(instance.hasEiendomValue({})).toBe(true);
        });

        it("should return true if hasEiendomNummerField returns true", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresse").mockReturnValue(false);
            jest.spyOn(instance, "hasEiendomNummerField").mockReturnValue(true);
            expect(instance.hasEiendomValue({})).toBe(true);
        });

        it("should return false if both checks return false", () => {
            const instance = new CustomTableEiendom({});
            jest.spyOn(instance, "hasAdresse").mockReturnValue(false);
            jest.spyOn(instance, "hasEiendomNummerField").mockReturnValue(false);
            expect(instance.hasEiendomValue({})).toBe(false);
        });
    });

    describe("getTextResourceBindings", () => {
        it("should return default resource bindings if no overrides", () => {
            const instance = new CustomTableEiendom({});
            const result = instance.getTextResourceBindings({});
            expect(result.adresse.title).toBe("resource.eiendomByggested.eiendom.adresse.title");
            expect(result.adresse.emptyFieldText).toBe("resource.eiendomByggested.eiendom.adresse.emptyFieldText");
            expect(result.eiendomByggested.title).toBe("resource.eiendomByggested.eiendom.title");
            expect(result.eiendomByggested.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use overrides from props.resourceBindings", () => {
            const props = {
                resourceBindings: {
                    adresse: { title: "customTitle", emptyFieldText: "customEmpty" },
                    title: "customMainTitle",
                    emptyFieldText: "customMainEmpty"
                }
            };
            const instance = new CustomTableEiendom({});
            const result = instance.getTextResourceBindings(props);
            expect(result.adresse.title).toBe("customTitle");
            expect(result.adresse.emptyFieldText).toBe("customEmpty");
            expect(result.eiendomByggested.title).toBe("customMainTitle");
            expect(result.eiendomByggested.emptyFieldText).toBe("customMainEmpty");
        });

        it("should omit title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTableEiendom({});
            const result = instance.getTextResourceBindings(props);
            expect(result.eiendomByggested.title).toBeUndefined();
        });

        it("should omit emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTableEiendom({});
            const result = instance.getTextResourceBindings(props);
            expect(result.eiendomByggested.emptyFieldText).toBeUndefined();
        });
    });
});
