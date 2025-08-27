import CustomFieldPartNavn from "./CustomFieldPartNavn";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

// Mocks
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../data-classes/Part.js", () => {
    return jest.fn().mockImplementation((data) => data);
});

describe("CustomFieldPartNavn", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty and resourceValues when data is present", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                }
            };
            getComponentDataValue.mockReturnValue({ navn: "Test Name", organisasjonsnummer: "123456789" });
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);
            hasValue.mockReturnValue(true);

            const instance = new CustomFieldPartNavn(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toContain("Test Name");
            expect(instance.resourceValues.data).toContain("Organisasjonsnummer: 123456789");
        });

        it("should set isEmpty and resourceValues when data is empty", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                }
            };
            getComponentDataValue.mockReturnValue({});
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);
            hasValue.mockReturnValue(false);

            const instance = new CustomFieldPartNavn(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toBe("resource:emptyKey");
        });
    });

    describe("formatName", () => {
        it("should return empty string if part.navn is missing", () => {
            const instance = new CustomFieldPartNavn({});
            expect(instance.formatName({}, false)).toBe("");
            expect(instance.formatName({ organisasjonsnummer: "123" }, false)).toBe("");
        });

        it("should return name only if hideOrgNr is true", () => {
            const instance = new CustomFieldPartNavn({});
            const part = { navn: "Test Name", organisasjonsnummer: "123456789" };
            expect(instance.formatName(part, true)).toBe("Test Name");
        });

        it("should return name and org number if hideOrgNr is false and org number exists", () => {
            const instance = new CustomFieldPartNavn({});
            const part = { navn: "Test Name", organisasjonsnummer: "123456789" };
            expect(instance.formatName(part, false)).toBe("Test Name\nOrganisasjonsnummer: 123456789");
        });

        it("should return name only if org number does not exist", () => {
            const instance = new CustomFieldPartNavn({});
            const part = { navn: "Test Name" };
            expect(instance.formatName(part, false)).toBe("Test Name");
        });
    });

    describe("getValueFromFormData", () => {
        it("should format name using form data and hideOrgNr", () => {
            const props = {};
            getComponentDataValue.mockReturnValue({ navn: "Test Name", organisasjonsnummer: "987654321" });
            const instance = new CustomFieldPartNavn(props);
            instance.hideOrgNr = false;
            expect(instance.getValueFromFormData(props)).toBe("Test Name\nOrganisasjonsnummer: 987654321");
            instance.hideOrgNr = true;
            expect(instance.getValueFromFormData(props)).toBe("Test Name");
        });
    });

    describe("hasContent", () => {
        it("should delegate to hasValue", () => {
            const instance = new CustomFieldPartNavn({});
            hasValue.mockReturnValue(true);
            expect(instance.hasContent("data")).toBe(true);
            hasValue.mockReturnValue(false);
            expect(instance.hasContent("data")).toBe(false);
        });
    });
});
