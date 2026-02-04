import CustomFieldAdresse from "./CustomFieldAdresse";

// Mocks for dependencies
jest.mock("../../data-classes/Adresse", () => {
    return jest.fn().mockImplementation((data) => data);
});
jest.mock("../CustomComponent", () => {
    return jest.fn().mockImplementation(function (props) {
        this.props = props;
    });
});
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn((props) => props.formData || {}),
    getComponentResourceValue: jest.fn((props, key) => props.resourceBindings?.[key] || `resource.${key}`),
    getTextResourceFromResourceBinding: jest.fn((key) => (key ? `text:${key}` : "")),
    getTextResources: jest.fn(() => ({ title: "Adresse", emptyFieldText: "Ingen adresse" })),
    hasValue: jest.fn((obj) => {
        if (obj === undefined || obj === null) {
            return false;
        }
        if (typeof obj === "string") {
            return obj.length > 0;
        }
        if (typeof obj === "number") {
            return true;
        }
        if (Array.isArray(obj)) {
            return obj.length > 0;
        }
        if (typeof obj === "object") {
            return Object.values(obj).some((value) => typeof value === "string" && value.length > 0);
        }
        return false;
    })
}));
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(() => false),
    hasValidationMessages: jest.fn((messages) => !!messages)
}));

describe("CustomFieldAdresse", () => {
    describe("formatAdresselinje", () => {
        it("formats non-empty address lines separated by newline", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = { adresselinje1: "A", adresselinje2: "", adresselinje3: "C" };
            expect(instance.formatAdresselinje(adresse)).toBe("A\nC");
        });
        it("returns empty string if all lines are empty", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatAdresselinje({})).toBe("");
        });
    });

    describe("formatZipCity", () => {
        it("formats zip and city separated by space", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatZipCity({ postnr: "1234", poststed: "Oslo" })).toBe("1234 Oslo");
        });
        it("returns only zip if city is missing", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatZipCity({ postnr: "1234" })).toBe("1234");
        });
        it("returns only city if zip is missing", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatZipCity({ poststed: "Oslo" })).toBe("Oslo");
        });
        it("returns empty string if both are missing", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatZipCity({})).toBe("");
        });
    });

    describe("formatKommunenavn", () => {
        it("returns kommunenavn if present", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatKommunenavn({ kommunenavn: "Bergen" })).toBe("Bergen");
        });
        it("returns empty string if kommunenavn is missing", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.formatKommunenavn({})).toBe("");
        });
    });

    describe("formatAdresse", () => {
        let instance;
        beforeEach(() => {
            instance = new CustomFieldAdresse({});
        });
        it("returns address lines and zip/city if both present", () => {
            const adresse = { adresselinje1: "A", postnr: "1234", poststed: "Oslo" };
            const resourceBindings = { emptyFieldText: "empty" };
            expect(instance.formatAdresse(adresse, resourceBindings)).toBe("A\n1234 Oslo");
        });
        it("returns only address lines if zip/city missing", () => {
            const adresse = { adresselinje1: "A" };
            const resourceBindings = { emptyFieldText: "empty" };
            expect(instance.formatAdresse(adresse, resourceBindings)).toBe("A");
        });
        it("returns only zip/city if address lines missing", () => {
            const adresse = { postnr: "1234", poststed: "Oslo" };
            const resourceBindings = { emptyFieldText: "empty" };
            expect(instance.formatAdresse(adresse, resourceBindings)).toBe("1234 Oslo");
        });
        it("returns emptyFieldText and kommunenavn if only kommunenavn present", () => {
            const adresse = { kommunenavn: "Bergen" };
            const resourceBindings = { emptyFieldText: "empty" };
            expect(instance.formatAdresse(adresse, resourceBindings)).toBe("text:empty\nBergen");
        });
        it("returns empty string if nothing present", () => {
            const adresse = {};
            const resourceBindings = { emptyFieldText: "empty" };
            expect(instance.formatAdresse(adresse, resourceBindings)).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("returns formatted address string from formData", () => {
            const props = { formData: { adresselinje1: "A", postnr: "1234", poststed: "Oslo" } };
            const instance = new CustomFieldAdresse(props);
            const resourceBindings = { emptyFieldText: "empty" };
            expect(instance.getValueFromFormData(props, resourceBindings)).toBe("A\n1234 Oslo");
        });
    });

    describe("hasContent", () => {
        it("returns true if any address field has value", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.hasContent({ adresselinje1: "A" })).toBe(true);
            expect(instance.hasContent({ postnr: "1234" })).toBe(true);
            expect(instance.hasContent({ poststed: "Oslo" })).toBe(true);
        });
        it("returns false if all fields are empty", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.hasContent({})).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("returns default resource bindings if none provided", () => {
            const instance = new CustomFieldAdresse({});
            expect(instance.getResourceBindings({})).toEqual({
                adresse: {
                    title: "resource.eiendom.adresse.title",
                    emptyFieldText: "resource.emptyFieldText.address"
                }
            });
        });
        it("returns custom resource bindings if provided", () => {
            const props = {
                resourceBindings: {
                    title: "custom.title",
                    emptyFieldText: "custom.empty"
                }
            };
            const instance = new CustomFieldAdresse(props);
            expect(instance.getResourceBindings(props)).toEqual({
                adresse: {
                    title: "custom.title",
                    emptyFieldText: "custom.empty"
                }
            });
        });
        it("omits title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomFieldAdresse(props);
            expect(instance.getResourceBindings(props)).toEqual({
                adresse: {
                    emptyFieldText: "resource.emptyFieldText.address"
                }
            });
        });
        it("omits emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomFieldAdresse(props);
            expect(instance.getResourceBindings(props)).toEqual({
                adresse: {
                    title: "resource.eiendom.adresse.title"
                }
            });
        });
    });

    describe("constructor", () => {
        it("sets validationMessages, hasValidationMessages, isEmpty, and resourceValues", () => {
            const props = {
                formData: { adresselinje1: "A", postnr: "1234", poststed: "Oslo" },
                resourceBindings: { title: "custom.title", emptyFieldText: "custom.empty" }
            };
            const instance = new CustomFieldAdresse(props);
            expect(instance.validationMessages).toBe(false);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceValues.data).toBe("A\n1234 Oslo");
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("text:custom.title");
        });
        it("sets isEmpty true and uses emptyFieldText if no address data", () => {
            const props = {
                formData: {},
                resourceBindings: { title: "custom.title", emptyFieldText: "custom.empty" }
            };
            const instance = new CustomFieldAdresse(props);
            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("text:custom.empty");
        });
    });
});
