import CustomListPlanlagteLoefteinnretninger from "./CustomListPlanlagteLoefteinnretninger";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Loefteinnretninger.js", () => {
    return jest.fn().mockImplementation((data) => ({ mockData: data }));
});
jest.mock("../data-classes/PlanlagteLoefteinnretningerList.js", () => {
    return jest.fn().mockImplementation((loefteinnretninger) => ({
        resourceValues: { data: loefteinnretninger.mockData }
    }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomListPlanlagteLoefteinnretninger", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if no data is present", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Empty");

        const props = {};
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if data is present", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockImplementation((val) => !!val);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Title");

        const props = {};
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toEqual({ foo: "bar" });
    });

    it("should set hasValidationMessages based on validationMessages", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue(true);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.validationMessages).toBe(true);
    });

    it("should use custom resourceBindings if provided", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Empty");

        const props = {
            resourceBindings: {
                planleggesHeis: { title: "custom.heis.title" },
                emptyFieldText: "custom.empty.text"
            }
        };
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.resourceBindings.emptyFieldText).toBe("custom.empty.text");
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should omit loefteinnretninger emptyFieldText if hideIfEmpty is true", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            hideIfEmpty: true,
            resourceBindings: {
                emptyFieldText: "custom.empty.text"
            }
        };
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.resourceBindings.emptyFieldText).toBeUndefined();
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none provided", () => {
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const bindings = instance.getResourceBindings({});
            expect(bindings.planleggesHeis.title).toContain("resource.rammebetingelser.loefteinnretninger.planleggesHeis.title");
            expect(bindings.loefteinnretninger.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use provided resourceBindings", () => {
            const props = {
                resourceBindings: {
                    planleggesHeis: { title: "custom.heis.title" },
                    emptyFieldText: "custom.empty.text"
                }
            };
            const instance = new CustomListPlanlagteLoefteinnretninger(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.planleggesHeis.title).toBe("custom.heis.title");
            expect(bindings.loefteinnretninger.emptyFieldText).toBe("custom.empty.text");
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            expect(instance.hasContent("something")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            global.window = { textResources: ["foo", "bar"] };
            hasMissingTextResources.mockReturnValue("missing");
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(result).toBe("missing");
            delete global.window;
        });

        it("should call hasMissingTextResources with empty array if window.textResources is undefined", () => {
            hasMissingTextResources.mockReturnValue("missing");
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toBe("missing");
        });
    });

    describe("getValueFromFormData", () => {
        it("should return undefined if hasValue returns false", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValueFromFormData({}, {});
            expect(result).toBeUndefined();
        });

        it("should return data if hasValue returns true", () => {
            getComponentDataValue.mockReturnValue({ foo: "bar" });
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValueFromFormData({}, {});
            expect(result).toEqual({ foo: "bar" });
        });
    });
});
