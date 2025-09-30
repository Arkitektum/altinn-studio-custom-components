import CustomGrouplistVarsling from "./CustomGrouplistVarsling";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav";
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for global functions
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGrouplistVarsling", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true if no content", () => {
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue({});
            getTextResourceFromResourceBinding.mockReturnValue("Empty");
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            const props = {};
            const instance = new CustomGrouplistVarsling(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
            expect(instance.hasValidationMessages).toBe(false);
        });

        it("should set isEmpty to false if there is content", () => {
            hasValue.mockReturnValue(true);
            getComponentDataValue.mockReturnValue({ foreliggerMerknader: "remark" });
            getTextResourceFromResourceBinding.mockReturnValue("SomeText");
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            // getSjekklistekravItems returns array if hasValue is true
            const props = {};
            const instance = new CustomGrouplistVarsling(props);

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
            expect(instance.hasValidationMessages).toBe(false);
        });

        it("should set validationMessages from hasMissingTextResources", () => {
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue({});
            getTextResourceFromResourceBinding.mockReturnValue("Empty");
            hasMissingTextResources.mockReturnValue(["Missing"]);
            hasValidationMessages.mockReturnValue(true);

            const props = {};
            const instance = new CustomGrouplistVarsling(props);

            expect(instance.validationMessages).toEqual(["Missing"]);
            expect(instance.hasValidationMessages).toBe(true);
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGrouplistVarsling({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistVarsling({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("calls hasMissingTextResources with textResources and resourceBindings", () => {
            getTextResources.mockReturnValue(["res1", "res2"]);
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomGrouplistVarsling({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(getTextResources).toHaveBeenCalled();
            expect(hasMissingTextResources).toHaveBeenCalledWith(["res1", "res2"], { foo: "bar" });
            expect(result).toEqual(["msg"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns sjekklistekravItems from getSjekklistekravItems", () => {
            getComponentDataValue.mockReturnValue({ foreliggerMerknader: "remark" });
            const instance = new CustomGrouplistVarsling({});
            const spy = jest.spyOn(instance, "getSjekklistekravItems").mockReturnValue(["item"]);
            const result = instance.getValueFromFormData({}, {});
            expect(spy).toHaveBeenCalled();
            expect(result).toEqual(["item"]);
        });
    });

    describe("getSjekklistekravItems", () => {
        it("returns null if no items", () => {
            const instance = new CustomGrouplistVarsling({});
            jest.spyOn(instance, "getSjekklistekravForFritattFraNabovarsling").mockReturnValue(undefined);
            jest.spyOn(instance, "getSjekklistekravForForeliggerMerknader").mockReturnValue(undefined);
            const result = instance.getSjekklistekravItems({}, {});
            expect(result).toBeNull();
        });

        it("returns array with items if present", () => {
            const instance = new CustomGrouplistVarsling({});
            const item1 = {};
            const item2 = {};
            jest.spyOn(instance, "getSjekklistekravForFritattFraNabovarsling").mockReturnValue(item1);
            jest.spyOn(instance, "getSjekklistekravForForeliggerMerknader").mockReturnValue(item2);
            const result = instance.getSjekklistekravItems({}, {});
            expect(result).toEqual([item1, item2]);
        });
    });

    describe("getSjekklistekravForFritattFraNabovarsling", () => {
        it("returns Sjekklistekrav if fritattFraNabovarsling has value", () => {
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("FritattTitle");
            const instance = new CustomGrouplistVarsling({});
            const result = instance.getSjekklistekravForFritattFraNabovarsling(
                { fritattFraNabovarsling: "yes" },
                { fritattFraNabovarsling: { title: "titleKey" } }
            );
            expect(result).toBeInstanceOf(Sjekklistekrav);
            expect(result.sjekklistepunktsvar).toBe("yes");
            expect(result.sjekklistepunkt.kodebeskrivelse).toBe("FritattTitle");
        });

        it("returns undefined if fritattFraNabovarsling has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistVarsling({});
            const result = instance.getSjekklistekravForFritattFraNabovarsling({}, { fritattFraNabovarsling: { title: "titleKey" } });
            expect(result).toBeUndefined();
        });
    });

    describe("getSjekklistekravForForeliggerMerknader", () => {
        it("returns Sjekklistekrav if foreliggerMerknader has value", () => {
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("MerknadTitle");
            const instance = new CustomGrouplistVarsling({});
            const result = instance.getSjekklistekravForForeliggerMerknader(
                { foreliggerMerknader: "remark" },
                { foreliggerMerknader: { title: "titleKey" } }
            );
            expect(result).toBeInstanceOf(Sjekklistekrav);
            expect(result.sjekklistepunktsvar).toBe("remark");
            expect(result.sjekklistepunkt.kodebeskrivelse).toBe("MerknadTitle");
        });

        it("returns undefined if foreliggerMerknader has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistVarsling({});
            const result = instance.getSjekklistekravForForeliggerMerknader({}, { foreliggerMerknader: { title: "titleKey" } });
            expect(result).toBeUndefined();
        });
    });

    describe("getResourceBindings", () => {
        it("returns default resource bindings if none provided", () => {
            const instance = new CustomGrouplistVarsling({});
            const result = instance.getResourceBindings({});
            expect(result.varsling.trueText).toBe("resource.trueText.default");
            expect(result.varsling.falseText).toBe("resource.falseText.default");
            expect(result.varsling.defaultText).toBe("resource.defaultText.default");
            expect(result.varsling.title).toBe("resource.varsling.title");
            expect(result.varsling.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("returns provided resource bindings", () => {
            const props = {
                resourceBindings: {
                    trueText: "yes",
                    falseText: "no",
                    defaultText: "default",
                    fritattFraNabovarsling: { title: "fritattTitle" },
                    foreliggerMerknader: { title: "merknadTitle" },
                    title: "customTitle",
                    emptyFieldText: "emptyText"
                }
            };
            const instance = new CustomGrouplistVarsling(props);
            const result = instance.getResourceBindings(props);
            expect(result.varsling.trueText).toBe("yes");
            expect(result.varsling.falseText).toBe("no");
            expect(result.varsling.defaultText).toBe("default");
            expect(result.varsling.fritattFraNabovarsling.title).toBe("fritattTitle");
            expect(result.varsling.foreliggerMerknader.title).toBe("merknadTitle");
            expect(result.varsling.title).toBe("customTitle");
            expect(result.varsling.emptyFieldText).toBe("emptyText");
        });

        it("does not set title if hideTitle is true", () => {
            const props = { hideTitle: true, resourceBindings: {} };
            const instance = new CustomGrouplistVarsling(props);
            const result = instance.getResourceBindings(props);
            expect(result.varsling.title).toBeUndefined();
        });

        it("does not set emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true, resourceBindings: {} };
            const instance = new CustomGrouplistVarsling(props);
            const result = instance.getResourceBindings(props);
            expect(result.varsling.emptyFieldText).toBeUndefined();
        });
    });
});
