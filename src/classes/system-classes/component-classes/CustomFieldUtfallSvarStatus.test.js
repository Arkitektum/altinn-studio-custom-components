import CustomFieldUtfallSvarStatus from "./CustomFieldUtfallSvarStatus";
import UtfallSvarStatus from "../../data-classes/UtfallSvarStatus";
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

// Mocks for helper functions and classes
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    getTextResourcesFromResourceBindings: jest.fn(),
    hasValue: jest.fn(),
    validateTexts: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));
jest.mock("../../data-classes/UtfallSvarStatus.js");

const {
    getComponentDataValue,
    getComponentResourceValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    getTextResourcesFromResourceBindings,
    hasValue,
    validateTexts
} = require("../../../functions/helpers.js");

describe("CustomFieldUtfallSvarStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, and resourceValues correctly when data is present", () => {
            const props = { id: "comp1", resourceBindings: { title: "custom.title" } };
            getComponentDataValue.mockReturnValue({ erUtfallBesvaresSenere: true });
            UtfallSvarStatus.mockImplementation((data) => data);
            getTextResourcesFromResourceBindings.mockReturnValue({
                erUtfallBesvaresSenere: "Senere tekst",
                erUtfallBesvart: "Besvart tekst",
                status: "Status tekst"
            });
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("Tittel tekst");
            getComponentResourceValue.mockReturnValue("Tomt felt");
            getTextResources.mockReturnValue({});
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomFieldUtfallSvarStatus(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toEqual([]);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceValues.title).toBe("Tittel tekst");
            expect(instance.resourceValues.data).toBe("Senere tekst");
        });

        it("should set isEmpty true and use emptyFieldText when data is empty", () => {
            const props = {};
            getComponentDataValue.mockReturnValue(null);
            UtfallSvarStatus.mockImplementation((data) => data);
            getTextResourcesFromResourceBindings.mockReturnValue({});
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Tittel tekst");
            getComponentResourceValue.mockReturnValue("Tomt felt");
            getTextResources.mockReturnValue({});
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomFieldUtfallSvarStatus(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Tomt felt");
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomFieldUtfallSvarStatus({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomFieldUtfallSvarStatus({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            getTextResources.mockReturnValue({ a: 1 });
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ a: 1 }, { foo: "bar" });
            expect(result).toEqual(["msg"]);
        });
    });

    describe("getStatusText", () => {
        beforeEach(() => {
            validateTexts.mockClear();
        });

        it("returns erUtfallBesvaresSenere text if erUtfallBesvaresSenere is true", () => {
            getTextResourcesFromResourceBindings.mockReturnValue({
                erUtfallBesvaresSenere: "Senere tekst",
                erUtfallBesvart: "Besvart tekst",
                status: "Status tekst"
            });
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getStatusText({ erUtfallBesvaresSenere: true }, {}, "comp1");
            expect(result).toBe("Senere tekst");
        });

        it("returns fallback erUtfallBesvaresSenere if text is missing", () => {
            getTextResourcesFromResourceBindings.mockReturnValue({});
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getStatusText({ erUtfallBesvaresSenere: true }, {}, "comp1");
            expect(result).toBe("Besvares senere");
        });

        it("returns erUtfallBesvart text if erUtfallBesvart is true", () => {
            getTextResourcesFromResourceBindings.mockReturnValue({
                erUtfallBesvaresSenere: "Senere tekst",
                erUtfallBesvart: "Besvart tekst",
                status: "Status tekst"
            });
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getStatusText({ erUtfallBesvart: true }, {}, "comp1");
            expect(result).toBe("Besvart tekst");
        });

        it("returns fallback erUtfallBesvart if text is missing", () => {
            getTextResourcesFromResourceBindings.mockReturnValue({});
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getStatusText({ erUtfallBesvart: true }, {}, "comp1");
            expect(result).toBe("Svar innsendt tidligere");
        });

        it("returns status text if neither erUtfallBesvaresSenere nor erUtfallBesvart", () => {
            getTextResourcesFromResourceBindings.mockReturnValue({
                status: "Status tekst"
            });
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getStatusText({}, {}, "comp1");
            expect(result).toBe("Status tekst");
        });

        it("returns fallback status if text is missing", () => {
            getTextResourcesFromResourceBindings.mockReturnValue({});
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getStatusText({}, {}, "comp1");
            expect(result).toBe("Besvares nå");
        });
    });

    describe("getValueFromFormData", () => {
        it("should create UtfallSvarStatus and call getStatusText", () => {
            getComponentDataValue.mockReturnValue({ erUtfallBesvaresSenere: true });
            UtfallSvarStatus.mockImplementation((data) => data);
            const instance = new CustomFieldUtfallSvarStatus({});
            jest.spyOn(instance, "getStatusText").mockReturnValue("Status text");
            const result = instance.getValueFromFormData({ id: "comp1" }, {});
            expect(instance.getStatusText).toHaveBeenCalledWith({ erUtfallBesvaresSenere: true }, {}, "comp1");
            expect(result).toBe("Status text");
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none provided", () => {
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getResourceBindings({});
            expect(result.utfallSvarStatus.title).toBe("resource.utfallBesvarelse.utfallSvar.status.title");
            expect(result.utfallSvarStatus.erUtfallBesvaresSenere).toBe("resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere");
            expect(result.utfallSvarStatus.erUtfallBesvart).toBe("resource.utfallBesvarelse.utfallSvar.erUtfallBesvart");
            expect(result.utfallSvarStatus.status).toBe("resource.utfallBesvarelse.utfallSvar.status");
        });

        it("should override title if provided in props.resourceBindings", () => {
            const instance = new CustomFieldUtfallSvarStatus({});
            const result = instance.getResourceBindings({ resourceBindings: { title: "custom.title" } });
            expect(result.utfallSvarStatus.title).toBe("custom.title");
        });
    });
});
