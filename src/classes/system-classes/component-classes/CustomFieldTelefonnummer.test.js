import CustomFieldTelefonnummer from "./CustomFieldTelefonnummer";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Telefonnumre.js", () => {
    return function Telefonnumre(data) {
        return data;
    };
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomFieldTelefonnummer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("formatPhoneNumbers", () => {
        it("formats both phone and mobile numbers on separate lines", () => {
            const instance = new CustomFieldTelefonnummer({});
            const result = instance.formatPhoneNumbers({
                telefonnummer: "12345678",
                mobilnummer: "87654321"
            });
            expect(result).toBe("12345678\n87654321");
        });

        it("formats only phone number if mobile number is missing", () => {
            const instance = new CustomFieldTelefonnummer({});
            const result = instance.formatPhoneNumbers({
                telefonnummer: "12345678",
                mobilnummer: ""
            });
            expect(result).toBe("12345678");
        });

        it("formats only mobile number if phone number is missing", () => {
            const instance = new CustomFieldTelefonnummer({});
            const result = instance.formatPhoneNumbers({
                telefonnummer: "",
                mobilnummer: "87654321"
            });
            expect(result).toBe("87654321");
        });

        it("returns empty string if both numbers are missing", () => {
            const instance = new CustomFieldTelefonnummer({});
            const result = instance.formatPhoneNumbers({
                telefonnummer: "",
                mobilnummer: ""
            });
            expect(result).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("calls getComponentDataValue and formats the result", () => {
            getComponentDataValue.mockReturnValue({
                telefonnummer: "12345678",
                mobilnummer: "87654321"
            });
            const instance = new CustomFieldTelefonnummer({});
            const result = instance.getValueFromFormData({});
            expect(getComponentDataValue).toHaveBeenCalled();
            expect(result).toBe("12345678\n87654321");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomFieldTelefonnummer({});
            expect(instance.hasContent("someData")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("someData");
        });

        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomFieldTelefonnummer({});
            expect(instance.hasContent("")).toBe(false);
            expect(hasValue).toHaveBeenCalledWith("");
        });
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues when data is present", () => {
            getComponentDataValue.mockReturnValue({
                telefonnummer: "12345678",
                mobilnummer: "87654321"
            });
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);

            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                }
            };
            const instance = new CustomFieldTelefonnummer(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("text:titleKey");
            expect(instance.resourceValues.data).toBe("12345678\n87654321");
        });

        it("sets isEmpty and resourceValues when data is empty", () => {
            getComponentDataValue.mockReturnValue({
                telefonnummer: "",
                mobilnummer: ""
            });
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);

            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                }
            };
            const instance = new CustomFieldTelefonnummer(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("text:titleKey");
            expect(instance.resourceValues.data).toBe("text:emptyKey");
        });
    });
});
