import CustomFieldKommunensSaksnummer from "./CustomFieldKommunensSaksnummer";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/KommunensSaksnummer.js", () => {
    return function KommunensSaksnummer(data) {
        return data;
    };
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomFieldKommunensSaksnummer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("formatKommunensSaksnummer", () => {
        it("formats saksaar and sakssekvensnummer correctly", () => {
            const instance = new CustomFieldKommunensSaksnummer({});
            const input = { saksaar: 2024, sakssekvensnummer: 123 };
            expect(instance.formatKommunensSaksnummer(input)).toBe("2024/123");
        });

        it("returns only saksaar if sakssekvensnummer is missing", () => {
            const instance = new CustomFieldKommunensSaksnummer({});
            const input = { saksaar: 2024 };
            expect(instance.formatKommunensSaksnummer(input)).toBe("2024");
        });

        it("returns only sakssekvensnummer if saksaar is missing", () => {
            const instance = new CustomFieldKommunensSaksnummer({});
            const input = { sakssekvensnummer: 123 };
            expect(instance.formatKommunensSaksnummer(input)).toBe("123");
        });

        it("returns empty string if both are missing", () => {
            const instance = new CustomFieldKommunensSaksnummer({});
            expect(instance.formatKommunensSaksnummer({})).toBe("");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomFieldKommunensSaksnummer({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomFieldKommunensSaksnummer({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValueFromFormData", () => {
        it("calls getComponentDataValue and formats the result", () => {
            getComponentDataValue.mockReturnValue({ saksaar: 2024, sakssekvensnummer: 321 });
            const instance = new CustomFieldKommunensSaksnummer({});
            const props = { formData: { data: { saksaar: 2024, sakssekvensnummer: 321 } } };
            expect(instance.getValueFromFormData(props)).toBe("2024/321");
        });
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues when data is present", () => {
            getComponentDataValue.mockReturnValue({ saksaar: 2022, sakssekvensnummer: 1 });
            hasValue.mockReturnValue(true);
            getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings[key]);
            const props = {
                formData: { data: { saksaar: 2022, sakssekvensnummer: 1 } },
                resourceBindings: { title: "Title", emptyFieldText: "Empty" }
            };
            const instance = new CustomFieldKommunensSaksnummer(props);
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("Title");
            expect(instance.resourceValues.data).toBe("2022/1");
        });

        it("sets isEmpty and resourceValues when data is empty", () => {
            getComponentDataValue.mockReturnValue({});
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings[key]);
            const props = {
                formData: { data: {} },
                resourceBindings: { title: "Title", emptyFieldText: "Empty" }
            };
            const instance = new CustomFieldKommunensSaksnummer(props);
            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("Title");
            expect(instance.resourceValues.data).toBe("Empty");
        });
    });
});
