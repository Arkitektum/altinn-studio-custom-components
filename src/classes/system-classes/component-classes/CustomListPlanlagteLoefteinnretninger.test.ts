import type { ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomListPlanlagteLoefteinnretninger from "./CustomListPlanlagteLoefteinnretninger.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

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
jest.mock("../../data-classes/Loefteinnretninger.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ mockData: args[0] }));
});
jest.mock("../data-classes/PlanlagteLoefteinnretningerList.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({
        resourceValues: { data: (args[0] as { mockData?: unknown })?.mockData }
    }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomListPlanlagteLoefteinnretninger", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if no data is present", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(false);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty");

        const props = {};
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if data is present", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ foo: "bar" });
        (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(false);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Title");

        const props = {};
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toEqual({ foo: "bar" });
    });

    it("should set hasValidationMessages based on validationMessages", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(true);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {};
        const instance = new CustomListPlanlagteLoefteinnretninger(props);

        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.validationMessages).toBe(true);
    });

    it("should use custom resourceBindings if provided", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(false);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty");

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
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(false);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

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
            expect(bindings.planleggesHeis!.title).toContain("resource.rammebetingelser.loefteinnretninger.planleggesHeis.title");
            expect(bindings.loefteinnretninger!.emptyFieldText).toBe("resource.emptyFieldText.default");
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
            expect(bindings.planleggesHeis!.title).toBe("custom.heis.title");
            expect(bindings.loefteinnretninger!.emptyFieldText).toBe("custom.empty.text");
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            expect(instance.hasContent("something")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            global.window = { textResources: ["foo", "bar"] } as unknown as Window & typeof globalThis;
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue("missing");
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toBe("missing");
            delete (global as { window?: unknown }).window;
        });

        it("should call hasMissingTextResources with empty array if window.textResources is undefined", () => {
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue("missing");
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toBe("missing");
        });
    });

    describe("getValueFromFormData", () => {
        it("should return undefined if hasValue returns false", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValueFromFormData({}, {}) as unknown[];
            expect(result).toBeUndefined();
        });

        it("should return data if hasValue returns true", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ foo: "bar" });
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
            const instance = new CustomListPlanlagteLoefteinnretninger({});
            const result = instance.getValueFromFormData({}, {}) as unknown[];
            expect(result).toEqual({ foo: "bar" });
        });
    });
});
