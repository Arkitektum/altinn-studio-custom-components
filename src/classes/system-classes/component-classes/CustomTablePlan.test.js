import CustomTablePlan from "./CustomTablePlan";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/AndrePlaner.js", () => {
    return function AndrePlaner({ plan }) {
        this.plan = plan;
    };
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

describe("CustomTablePlan", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("sets isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is present", () => {
            getComponentDataValue.mockReturnValue("planData");
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue({ some: "validation" });
            hasValidationMessages.mockReturnValue(true);

            const props = { resourceBindings: { title: "customTitle" } };
            const instance = new CustomTablePlan(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toEqual({ some: "validation" });
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings.plan.title).toBe("customTitle");
            expect(instance.resourceValues.data).toBe("planData");
        });

        it("sets resourceValues.data to emptyFieldText when data is empty", () => {
            getComponentDataValue.mockReturnValue("");
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("emptyText");
            hasMissingTextResources.mockReturnValue({});
            hasValidationMessages.mockReturnValue(false);

            const props = {};
            const instance = new CustomTablePlan(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("emptyText");
        });
    });

    describe("getValueFromFormData", () => {
        it("returns the plan value from AndrePlaner", () => {
            getComponentDataValue.mockReturnValue("planData");
            const props = {};
            const instance = new CustomTablePlan(props);
            expect(instance.getValueFromFormData(props)).toBe("planData");
        });
    });

    describe("getValidationMessages", () => {
        it("calls hasMissingTextResources with window.textResources and bindings", () => {
            global.window = { textResources: ["res1", "res2"] };
            hasMissingTextResources.mockReturnValue("validationResult");
            const instance = new CustomTablePlan({});
            const result = instance.getValidationMessages({ key: "value" });
            expect(hasMissingTextResources).toHaveBeenCalledWith([], {
                navn: {
                    title: "resource.planer.andrePlaner.plan.navn.title",
                    emptyFieldText: "resource.emptyFieldText.default"
                },
                plantype: {
                    title: "resource.planer.andrePlaner.plan.plantype.title",
                    emptyFieldText: "resource.emptyFieldText.default"
                },
                plan: {
                    title: "resource.planer.andrePlaner.title",
                    emptyFieldText: "resource.emptyFieldText.default"
                }
            });
            expect(result).toBe("validationResult");
            delete global.window;
        });

        it("uses empty array if window.textResources is not defined", () => {
            hasMissingTextResources.mockReturnValue("validationResult");
            const instance = new CustomTablePlan({});
            const result = instance.getValidationMessages({ key: "value" });
            expect(hasMissingTextResources).toHaveBeenCalledWith([], { key: "value" });
            expect(result).toBe("validationResult");
        });
    });

    describe("hasContent", () => {
        it("returns result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTablePlan({});
            expect(instance.hasContent("data")).toBe(true);
            hasValue.mockReturnValue(false);
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("returns default bindings when no props are provided", () => {
            const instance = new CustomTablePlan({});
            const bindings = instance.getResourceBindings({});
            expect(bindings.navn.title).toBe("resource.planer.andrePlaner.plan.navn.title");
            expect(bindings.navn.emptyFieldText).toBe("resource.emptyFieldText.default");
            expect(bindings.plantype.title).toBe("resource.planer.andrePlaner.plan.plantype.title");
            expect(bindings.plantype.emptyFieldText).toBe("resource.emptyFieldText.default");
            expect(bindings.plan.title).toBe("resource.planer.andrePlaner.title");
            expect(bindings.plan.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("uses custom bindings from props", () => {
            const props = {
                resourceBindings: {
                    navn: { title: "navnTitle", emptyFieldText: "navnEmpty" },
                    plantype: { title: "plantypeTitle", emptyFieldText: "plantypeEmpty" },
                    title: "planTitle",
                    emptyFieldText: "planEmpty"
                }
            };
            const instance = new CustomTablePlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.navn.title).toBe("navnTitle");
            expect(bindings.navn.emptyFieldText).toBe("navnEmpty");
            expect(bindings.plantype.title).toBe("plantypeTitle");
            expect(bindings.plantype.emptyFieldText).toBe("plantypeEmpty");
            expect(bindings.plan.title).toBe("planTitle");
            expect(bindings.plan.emptyFieldText).toBe("planEmpty");
        });

        it("omits plan.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTablePlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.plan.title).toBeUndefined();
            expect(bindings.plan.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("omits plan.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTablePlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.plan.title).toBe("resource.planer.andrePlaner.title");
            expect(bindings.plan.emptyFieldText).toBeUndefined();
        });

        it("omits both plan.title and plan.emptyFieldText if both hideTitle and hideIfEmpty are true", () => {
            const props = { hideTitle: true, hideIfEmpty: true };
            const instance = new CustomTablePlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.plan.title).toBeUndefined();
            expect(bindings.plan.emptyFieldText).toBeUndefined();
        });

        it('handles hideTitle/hideIfEmpty as string "true"', () => {
            const props = { hideTitle: "true", hideIfEmpty: "true" };
            const instance = new CustomTablePlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.plan.title).toBeUndefined();
            expect(bindings.plan.emptyFieldText).toBeUndefined();
        });
    });
});
