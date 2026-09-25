import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import CustomFieldPartNavn from "./CustomFieldPartNavn.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

// Mocks
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("../../data-classes/Part.ts", () => {
    return jest.fn().mockImplementation((data) => data);
});
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
}));

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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ navn: "Test Name", organisasjonsnummer: "123456789" });
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `resource:${key}`);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);

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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({});
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `resource:${key}`);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ navn: "Test Name", organisasjonsnummer: "987654321" });
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
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            expect(instance.hasContent("data")).toBe(true);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            expect(instance.hasContent("data")).toBe(false);
        });
    });
});
