import CustomTableOmraaderisiko from "./CustomTableOmraaderisiko";
import Omraaderisiko from "../../data-classes/Omraaderisiko";

// Mocks for helpers and validations
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

describe("CustomTableOmraaderisiko", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues", () => {
            getComponentDataValue.mockReturnValue([{ risikotype: { kodebeskrivelse: "desc" } }]);
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");

            const props = {
                resourceBindings: {
                    eiendomByggested: { emptyFieldText: "emptyTextKey" }
                }
            };

            const instance = new CustomTableOmraaderisiko(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toBe(false);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.data).toEqual([expect.any(Omraaderisiko)]);
        });

        it("should set isEmpty true and resourceValues.data to emptyFieldText when no content", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue(true);
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");

            const props = {
                resourceBindings: {
                    eiendomByggested: { emptyFieldText: "emptyTextKey" }
                }
            };

            const instance = new CustomTableOmraaderisiko(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getOmraaderisikoListFromData", () => {
            getComponentDataValue.mockReturnValue([{ risikotype: { kodebeskrivelse: "desc" } }]);
            const instance = new CustomTableOmraaderisiko({});
            const spy = jest.spyOn(instance, "getOmraaderisikoListFromData");
            instance.getValueFromFormData({});
            expect(getComponentDataValue).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("getOmraaderisikoListFromData", () => {
        it("should return undefined if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.getOmraaderisikoListFromData(undefined)).toBeUndefined();
        });

        it("should return filtered Omraaderisiko instances", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableOmraaderisiko({});
            jest.spyOn(instance, "hasOmraaderisikoValue").mockImplementation((o) => !!o.risikotype);
            const data = [{ risikotype: { kodebeskrivelse: "desc" } }, { sikkerhetsklasse: {} }];
            const result = instance.getOmraaderisikoListFromData(data);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toBeInstanceOf(Omraaderisiko);
        });

        it("should return empty array if data is not array", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.getOmraaderisikoListFromData({})).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            global.window = { textResources: ["a", "b"] };
            hasMissingTextResources.mockReturnValue(true);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.getValidationMessages({})).toBe(true);
            delete global.window;
        });

        it("should call hasMissingTextResources with empty array if window.textResources is undefined", () => {
            global.window = {};
            hasMissingTextResources.mockReturnValue(false);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.getValidationMessages({})).toBe(false);
            delete global.window;
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.hasContent("data")).toBe(true);
            hasValue.mockReturnValue(false);
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("hasRisikotype", () => {
        it("should return true if risikotype.kodebeskrivelse has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.hasRisikotype({ risikotype: { kodebeskrivelse: "desc" } })).toBe(true);
        });

        it("should return false if risikotype.kodebeskrivelse has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.hasRisikotype({ risikotype: { kodebeskrivelse: "" } })).toBe(false);
        });
    });

    describe("hasSikkerhetsklasse", () => {
        it("should return true if sikkerhetsklasse.kodebeskrivelse has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.hasSikkerhetsklasse({ sikkerhetsklasse: { kodebeskrivelse: "desc" } })).toBe(true);
        });

        it("should return false if sikkerhetsklasse.kodebeskrivelse has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableOmraaderisiko({});
            expect(instance.hasSikkerhetsklasse({ sikkerhetsklasse: { kodebeskrivelse: "" } })).toBe(false);
        });
    });

    describe("hasOmraaderisikoValue", () => {
        it("should return true if hasRisikotype or hasSikkerhetsklasse returns true", () => {
            const instance = new CustomTableOmraaderisiko({});
            jest.spyOn(instance, "hasRisikotype").mockReturnValue(true);
            jest.spyOn(instance, "hasSikkerhetsklasse").mockReturnValue(false);
            expect(instance.hasOmraaderisikoValue({})).toBe(true);

            instance.hasRisikotype.mockReturnValue(false);
            instance.hasSikkerhetsklasse.mockReturnValue(true);
            expect(instance.hasOmraaderisikoValue({})).toBe(true);

            instance.hasRisikotype.mockReturnValue(false);
            instance.hasSikkerhetsklasse.mockReturnValue(false);
            expect(instance.hasOmraaderisikoValue({})).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default bindings if none provided", () => {
            const instance = new CustomTableOmraaderisiko({});
            const result = instance.getResourceBindings({});
            expect(result.risikotype.title).toContain("risikotype.title");
            expect(result.sikkerhetsklasse.title).toContain("sikkerhetsklasse.title");
            expect(result.omraadeRisiko.title).toContain("omraadeRisiko.title");
            expect(result.omraadeRisiko.emptyFieldText).toContain("emptyFieldText.default");
        });

        it("should use custom resourceBindings if provided", () => {
            const props = {
                resourceBindings: {
                    risikotype: { title: "customRisikotype", emptyFieldText: "customEmpty" },
                    sikkerhetsklasse: { title: "customSikkerhetsklasse", emptyFieldText: "customEmpty2" },
                    title: "customOmraadeRisiko",
                    emptyFieldText: "customOmraadeEmpty"
                }
            };
            const instance = new CustomTableOmraaderisiko({});
            const result = instance.getResourceBindings(props);
            expect(result.risikotype.title).toBe("customRisikotype");
            expect(result.risikotype.emptyFieldText).toBe("customEmpty");
            expect(result.sikkerhetsklasse.title).toBe("customSikkerhetsklasse");
            expect(result.sikkerhetsklasse.emptyFieldText).toBe("customEmpty2");
            expect(result.omraadeRisiko.title).toBe("customOmraadeRisiko");
            expect(result.omraadeRisiko.emptyFieldText).toBe("customOmraadeEmpty");
        });

        it("should omit omraadeRisiko.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTableOmraaderisiko({});
            const result = instance.getResourceBindings(props);
            expect(result.omraadeRisiko).toBeDefined();
            expect(result.omraadeRisiko.title).toBeUndefined();
        });

        it("should omit omraadeRisiko.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTableOmraaderisiko({});
            const result = instance.getResourceBindings(props);
            expect(result.omraadeRisiko.emptyFieldText).toBeUndefined();
        });
    });
});
