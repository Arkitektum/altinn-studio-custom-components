import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomFieldKommunensSaksnummer from "./CustomFieldKommunensSaksnummer.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks
jest.mock("../CustomComponent.ts", () => {
    const { hasValue } = require("@arkitektum/altinn-studio-custom-components-utils");
    const { hasMissingTextResources } = require("../../../functions/validations.ts");
    return class {
        hasContent(data: unknown) {
            return hasValue(data);
        }
        getValidationMessages(resourceBindings: unknown) {
            return hasMissingTextResources(resourceBindings);
        }
    };
});
jest.mock("../../data-classes/KommunensSaksnummer.ts", () => {
    return function KommunensSaksnummer(data: unknown) {
        return data;
    };
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
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
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomFieldKommunensSaksnummer({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomFieldKommunensSaksnummer({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValueFromFormData", () => {
        it("calls getComponentDataValue and formats the result", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ saksaar: 2024, sakssekvensnummer: 321 });
            const instance = new CustomFieldKommunensSaksnummer({});
            const props = { formData: { data: { saksaar: 2024, sakssekvensnummer: 321 } } };
            expect(instance.getValueFromFormData(props)).toBe("2024/321");
        });
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues when data is present", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ saksaar: 2022, sakssekvensnummer: 1 });
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => props.resourceBindings[key]);
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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({});
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => props.resourceBindings[key]);
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
