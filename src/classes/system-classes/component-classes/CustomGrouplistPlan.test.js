import CustomGrouplistPlan from "./CustomGrouplistPlan";
import {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/AndrePlaner.js", () => {
    return class {
        constructor({ plan }) {
            this.plan = plan;
        }
    };
});
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

describe("CustomGrouplistPlan", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data is empty", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistPlan(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("text:resource.emptyFieldText.default");
    });

    it("should set isEmpty to false if data is present", () => {
        getComponentDataValue.mockReturnValue("plan-data");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistPlan(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("plan-data");
    });

    it("should set validationMessages and hasValidationMessages", () => {
        getComponentDataValue.mockReturnValue("plan-data");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGrouplistPlan(props);

        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should use resourceBindings overrides from props", () => {
        getComponentDataValue.mockReturnValue("plan-data");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                navn: { title: "custom.navn.title" },
                plantype: { title: "custom.plantype.title" },
                title: "custom.andrePlaner.title",
                emptyFieldText: "custom.emptyFieldText"
            }
        };
        const instance = new CustomGrouplistPlan(props);

        expect(instance.resourceBindings.navn.title).toBe("custom.navn.title");
        expect(instance.resourceBindings.plantype.title).toBe("custom.plantype.title");
        expect(instance.resourceValues.title).toBe("text:custom.andrePlaner.title");
    });

    it("should not include title if hideTitle is true", () => {
        getComponentDataValue.mockReturnValue("plan-data");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = { hideTitle: true };
        const instance = new CustomGrouplistPlan(props);

        expect(instance.resourceValues.title).toBe("text:undefined");
    });

    it("should not include emptyFieldText if hideIfEmpty is true", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = { hideIfEmpty: true };
        const instance = new CustomGrouplistPlan(props);

        expect(instance.resourceValues.data).toBe("text:undefined");
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGrouplistPlan({});
            expect(instance.hasContent("data")).toBe(true);
        });
        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistPlan({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("returns missing text resources", () => {
            getTextResources.mockReturnValue(["res1", "res2"]);
            hasMissingTextResources.mockReturnValue(["missing1"]);
            const instance = new CustomGrouplistPlan({});
            expect(instance.getValidationMessages({})).toEqual(["missing1"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns plan from AndrePlaner", () => {
            getComponentDataValue.mockReturnValue("plan-data");
            const instance = new CustomGrouplistPlan({});
            expect(instance.getValueFromFormData({})).toBe("plan-data");
        });
    });

    describe("getResourceBindings", () => {
        it("returns default resource bindings", () => {
            const instance = new CustomGrouplistPlan({});
            const bindings = instance.getResourceBindings({});
            expect(bindings.navn.title).toBe("resource.planer.andrePlaner.plan.navn.title");
            expect(bindings.plantype.title).toBe("resource.planer.andrePlaner.plan.plantype.title");
            expect(bindings.andrePlaner.title).toBe("resource.planer.andrePlaner.title");
            expect(bindings.andrePlaner.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("returns overridden resource bindings", () => {
            const props = {
                resourceBindings: {
                    navn: { title: "custom.navn" },
                    plantype: { title: "custom.plantype" },
                    title: "custom.title",
                    emptyFieldText: "custom.empty"
                }
            };
            const instance = new CustomGrouplistPlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.navn.title).toBe("custom.navn");
            expect(bindings.plantype.title).toBe("custom.plantype");
            expect(bindings.andrePlaner.title).toBe("custom.title");
            expect(bindings.andrePlaner.emptyFieldText).toBe("custom.empty");
        });

        it("omits title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomGrouplistPlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.andrePlaner.title).toBeUndefined();
        });

        it("omits emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomGrouplistPlan(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.andrePlaner.emptyFieldText).toBeUndefined();
        });
    });
});
