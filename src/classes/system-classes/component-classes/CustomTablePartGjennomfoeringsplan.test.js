import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import CustomTablePartGjennomfoeringsplan from "./CustomTablePartGjennomfoeringsplan";

// Mocks for global functions
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const { getComponentDataValue } = require("../../../functions/helpers");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations");

describe("CustomTablePartGjennomfoeringsplan", () => {
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
            const instance = new CustomTablePartGjennomfoeringsplan(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
        });

        it("should set isEmpty to false if there is content", () => {
            getComponentDataValue.mockReturnValue({ navn: "Test" });
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const props = { formData: { data: { navn: "Test" } } };
            const instance = new CustomTablePartGjennomfoeringsplan(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual({ navn: "Test" });
        });
    });

    describe("getValueFromFormData", () => {
        it("should return undefined if hasValue returns false", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.getValueFromFormData({})).toBeUndefined();
        });

        it("should return the data object if hasPartValue returns true", () => {
            getComponentDataValue.mockReturnValue({ navn: "Test" });
            hasValue.mockReturnValue(true);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.getValueFromFormData({})).toEqual({ navn: "Test" });
        });

        it("should return undefined if data has value but no part value", () => {
            getComponentDataValue.mockReturnValue({ foo: "bar" });
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.getValueFromFormData({})).toBeUndefined();
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources", () => {
            hasMissingTextResources.mockReturnValue(true);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.getValidationMessages({})).toBe(true);
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("hasNavn", () => {
        it("should return true if navn has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasNavn({ navn: "Test" })).toBe(true);
        });

        it("should return false if navn has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasNavn({})).toBe(false);
        });
    });

    describe("hasOrganisasjonsnummer", () => {
        it("should return true if organisasjonsnummer has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasOrganisasjonsnummer({ organisasjonsnummer: "123" })).toBe(true);
        });

        it("should return false if organisasjonsnummer has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasOrganisasjonsnummer({})).toBe(false);
        });
    });

    describe("hasTiltaksklasse", () => {
        it("should return true if tiltaksklasse has value", () => {
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasTiltaksklasse({ tiltaksklasse: "1" })).toBe(true);
        });

        it("should return false if tiltaksklasse has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.hasTiltaksklasse({})).toBe(false);
        });
    });

    describe("hasPartValue", () => {
        it("should return true if hasNavn returns true", () => {
            const instance = new CustomTablePartGjennomfoeringsplan({});
            jest.spyOn(instance, "hasNavn").mockReturnValue(true);
            jest.spyOn(instance, "hasOrganisasjonsnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasTiltaksklasse").mockReturnValue(false);
            expect(instance.hasPartValue({})).toBe(true);
        });

        it("should return true if hasOrganisasjonsnummer returns true", () => {
            const instance = new CustomTablePartGjennomfoeringsplan({});
            jest.spyOn(instance, "hasNavn").mockReturnValue(false);
            jest.spyOn(instance, "hasOrganisasjonsnummer").mockReturnValue(true);
            jest.spyOn(instance, "hasTiltaksklasse").mockReturnValue(false);
            expect(instance.hasPartValue({})).toBe(true);
        });

        it("should return true if hasTiltaksklasse returns true", () => {
            const instance = new CustomTablePartGjennomfoeringsplan({});
            jest.spyOn(instance, "hasNavn").mockReturnValue(false);
            jest.spyOn(instance, "hasOrganisasjonsnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasTiltaksklasse").mockReturnValue(true);
            expect(instance.hasPartValue({})).toBe(true);
        });

        it("should return false if all checks return false", () => {
            const instance = new CustomTablePartGjennomfoeringsplan({});
            jest.spyOn(instance, "hasNavn").mockReturnValue(false);
            jest.spyOn(instance, "hasOrganisasjonsnummer").mockReturnValue(false);
            jest.spyOn(instance, "hasTiltaksklasse").mockReturnValue(false);
            expect(instance.hasPartValue({})).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("should generate default resource bindings", () => {
            const instance = new CustomTablePartGjennomfoeringsplan({});
            const result = instance.getResourceBindings({});
            expect(result.navn.title).toBe("resource.navn.title");
            expect(result.organisasjonsnummer.title).toBe("resource.organisasjonsnummer.title");
            expect(result.tiltaksklasse.title).toBe("resource.tiltaksklasse.title");
            expect(result.part.title).toBe("resource.soeker.title");
            expect(result.part.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use custom resource bindings if provided", () => {
            const props = {
                resourceBindings: {
                    navn: { title: "Custom Navn" },
                    organisasjonsnummer: { title: "Custom Orgnr" },
                    tiltaksklasse: { title: "Custom Tiltaksklasse" },
                    title: "Custom Header",
                    emptyFieldText: "Custom Empty"
                }
            };
            const instance = new CustomTablePartGjennomfoeringsplan({});
            const result = instance.getResourceBindings(props);
            expect(result.navn.title).toBe("Custom Navn");
            expect(result.organisasjonsnummer.title).toBe("Custom Orgnr");
            expect(result.tiltaksklasse.title).toBe("Custom Tiltaksklasse");
            expect(result.part.title).toBe("Custom Header");
            expect(result.part.emptyFieldText).toBe("Custom Empty");
        });

        it("should not include part.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTablePartGjennomfoeringsplan({});
            const result = instance.getResourceBindings(props);
            expect(result.part.title).toBeUndefined();
        });

        it("should not include part.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTablePartGjennomfoeringsplan({});
            const result = instance.getResourceBindings(props);
            expect(result.part.emptyFieldText).toBeUndefined();
        });
    });

    describe("getComponentUsage", () => {
        it("should return the list of used custom components", () => {
            const instance = new CustomTablePartGjennomfoeringsplan({});
            expect(instance.getComponentUsage()).toEqual([
                "custom-feedbacklist-validation-messages",
                "custom-field-data",
                "custom-table-data"
            ]);
        });
    });
});
