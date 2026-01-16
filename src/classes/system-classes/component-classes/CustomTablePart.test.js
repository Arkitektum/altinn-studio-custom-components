import CustomTablePart from "./CustomTablePart";
import Part from "../../data-classes/Part";

// Mocks for global functions
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations");

describe("CustomTablePart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true if no content", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const props = { resourceBindings: { emptyFieldText: "empty" } };
            const instance = new CustomTablePart(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
        });

        it("should set isEmpty to false if there is content", () => {
            getComponentDataValue.mockReturnValue({ navn: "Test" });
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            // hasPartValue returns true if hasNavnOrOrganisasjonsnummer returns true
            const props = { formData: { data: { navn: "Test" } } };
            const instance = new CustomTablePart(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toBeInstanceOf(Part);
        });
    });

    describe("getPartTypeFromElementAttributes", () => {
        it("should return parttype attribute if present", () => {
            const element = { getAttribute: jest.fn().mockReturnValue("customType") };
            const instance = new CustomTablePart({});
            expect(instance.getPartTypeFromElementAttributes(element)).toBe("customType");
        });

        it("should return default if parttype attribute is not present", () => {
            const element = { getAttribute: jest.fn().mockReturnValue(null) };
            const instance = new CustomTablePart({});
            expect(instance.getPartTypeFromElementAttributes(element)).toBe("tiltakshaver");
        });
    });

    describe("getValueFromFormData", () => {
        it("should return undefined if hasValue returns false", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePart({});
            expect(instance.getValueFromFormData({})).toBeUndefined();
        });

        it("should return Part instance if hasPartValue returns true", () => {
            getComponentDataValue.mockReturnValue({ navn: "Test" });
            hasValue.mockReturnValue(true);
            const instance = new CustomTablePart({});
            // hasPartValue returns true if hasNavnOrOrganisasjonsnummer returns true
            expect(instance.getValueFromFormData({})).toBeInstanceOf(Part);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            globalThis.window = { textResources: ["a", "b"] };
            hasMissingTextResources.mockReturnValue(true);
            const instance = new CustomTablePart({});
            expect(instance.getValidationMessages({})).toBe(true);
            delete globalThis.window;
        });

        it("should use empty array if window.textResources is not defined", () => {
            hasMissingTextResources.mockReturnValue(false);
            const instance = new CustomTablePart({});
            expect(instance.getValidationMessages({})).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTablePart({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePart({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("hasNavnOrOrganisasjonsnummer", () => {
        it("should return true if navn has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePart({});
            expect(instance.hasNavnOrOrganisasjonsnummer({ navn: "Test" })).toBe(true);
        });

        it("should return true if organisasjonsnummer has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePart({});
            expect(instance.hasNavnOrOrganisasjonsnummer({ organisasjonsnummer: "123" })).toBe(true);
        });

        it("should return false if neither has value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePart({});
            expect(instance.hasNavnOrOrganisasjonsnummer({})).toBe(false);
        });
    });

    describe("hasTelefonnummer", () => {
        it("should return true if telefonnummer has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePart({});
            expect(instance.hasTelefonnummer({ telefonnummer: "123" })).toBe(true);
        });

        it("should return true if mobilnummer has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePart({});
            expect(instance.hasTelefonnummer({ mobilnummer: "456" })).toBe(true);
        });

        it("should return false if neither has value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePart({});
            expect(instance.hasTelefonnummer({})).toBe(false);
        });
    });

    describe("hasEpost", () => {
        it("should return true if epost has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePart({});
            expect(instance.hasEpost({ epost: "test@test.com" })).toBe(true);
        });

        it("should return false if epost does not have value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePart({});
            expect(instance.hasEpost({})).toBe(false);
        });
    });

    describe("hasPartValue", () => {
        it("should return true if hasNavnOrOrganisasjonsnummer returns true", () => {
            const instance = new CustomTablePart({});
            jest.spyOn(instance, "hasNavnOrOrganisasjonsnummer").mockReturnValue(true);
            jest.spyOn(instance, "hasTelefonnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasEpost").mockReturnValue(false);
            expect(instance.hasPartValue({})).toBe(true);
        });

        it("should return true if hasTelefonnummer returns true", () => {
            const instance = new CustomTablePart({});
            jest.spyOn(instance, "hasNavnOrOrganisasjonsnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasTelefonnummer").mockReturnValue(true);
            jest.spyOn(instance, "hasEpost").mockReturnValue(false);
            expect(instance.hasPartValue({})).toBe(true);
        });

        it("should return true if hasEpost returns true", () => {
            const instance = new CustomTablePart({});
            jest.spyOn(instance, "hasNavnOrOrganisasjonsnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasTelefonnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasEpost").mockReturnValue(true);
            expect(instance.hasPartValue({})).toBe(true);
        });

        it("should return false if all checks return false", () => {
            const instance = new CustomTablePart({});
            jest.spyOn(instance, "hasNavnOrOrganisasjonsnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasTelefonnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasEpost").mockReturnValue(false);
            expect(instance.hasPartValue({})).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("should generate default resource bindings", () => {
            const instance = new CustomTablePart({});
            const result = instance.getResourceBindings({});
            expect(result.navn.title).toBe("resource.part.navn.title");
            expect(result.telefonnummer.title).toBe("resource.part.telefonnummer.title");
            expect(result.epost.title).toBe("resource.part.epost.title");
            expect(result.part.title).toBe("resource.tiltakshaver.title");
            expect(result.part.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use custom resource bindings if provided", () => {
            const props = {
                partType: "custom",
                resourceBindings: {
                    navn: { title: "Custom Navn" },
                    telefonnummer: { title: "Custom Tel" },
                    epost: { title: "Custom Epost" },
                    title: "Custom Header",
                    emptyFieldText: "Custom Empty"
                }
            };
            const instance = new CustomTablePart({});
            const result = instance.getResourceBindings(props);
            expect(result.navn.title).toBe("Custom Navn");
            expect(result.telefonnummer.title).toBe("Custom Tel");
            expect(result.epost.title).toBe("Custom Epost");
            expect(result.part.title).toBe("Custom Header");
            expect(result.part.emptyFieldText).toBe("Custom Empty");
        });

        it("should not include part.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTablePart({});
            const result = instance.getResourceBindings(props);
            expect(result.part.title).toBeUndefined();
        });

        it("should not include part.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTablePart({});
            const result = instance.getResourceBindings(props);
            expect(result.part.emptyFieldText).toBeUndefined();
        });
    });
});
