import type { ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGroupSjekklistekrav from "./CustomGroupSjekklistekrav.ts";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.ts";
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
jest.mock("../../data-classes/Sjekklistekrav.ts", () => {
    return jest.fn().mockImplementation((data) => ({ mockData: data }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupSjekklistekrav", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with empty data and default resource bindings", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty Field");
        (getTextResources as unknown as jest.Mock).mockReturnValue(["res1", "res2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupSjekklistekrav(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceBindings).toEqual({
            trueText: "resource.trueText.default",
            falseText: "resource.falseText.default",
            defaultText: "resource.emptyFieldText.default",
            emptyFieldText: "resource.emptyFieldText.default"
        });
        expect(instance.resourceValues.data).toBe("Empty Field");
        expect(instance.validationMessages).toEqual([]);
        expect(instance.hasValidationMessages).toBe(false);
    });

    it("should initialize with provided resource bindings and non-empty data", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("someData");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Should not be used");
        (getTextResources as unknown as jest.Mock).mockReturnValue(["res1", "res2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {
            resourceBindings: {
                trueText: "customTrue",
                falseText: "customFalse",
                defaultText: "customDefault",
                emptyFieldText: "customEmpty"
            }
        };
        const instance = new CustomGroupSjekklistekrav(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceBindings).toEqual({
            trueText: "customTrue",
            falseText: "customFalse",
            defaultText: "customDefault",
            emptyFieldText: "customEmpty"
        });
        expect(instance.resourceValues.data).toEqual({ mockData: "someData" });
        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should omit emptyFieldText if hideIfEmpty is true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);

        const props = {
            resourceBindings: {
                trueText: "customTrue",
                falseText: "customFalse",
                defaultText: "customDefault",
                emptyFieldText: "customEmpty"
            },
            hideIfEmpty: true
        };
        const instance = new CustomGroupSjekklistekrav(props);

        expect(instance.resourceBindings).toEqual({
            trueText: "customTrue",
            falseText: "customFalse",
            defaultText: "customDefault"
        });
    });

    it("hasContent should delegate to hasValue", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const instance = new CustomGroupSjekklistekrav({});
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        (getTextResources as unknown as jest.Mock).mockReturnValue(["res1"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["msg"]);
        const instance = new CustomGroupSjekklistekrav({});
        const result = instance.getValidationMessages({ test: "value" } as unknown as Record<string, ResourceBindingGroup>);
        expect(hasMissingTextResources).toHaveBeenCalledWith({ test: "value" } as unknown as Record<string, ResourceBindingGroup>);
        expect(result).toEqual(["msg"]);
    });

    it("getValueFromFormData should return Sjekklistekrav instance", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        const instance = new CustomGroupSjekklistekrav({});
        const result = instance.getValueFromFormData({});
        expect(Sjekklistekrav).toHaveBeenCalledWith("data");
        expect(result).toEqual({ mockData: "data" });
    });

    it("getResourceBindings should set defaults if not provided", () => {
        const instance = new CustomGroupSjekklistekrav({});
        const result = instance.getResourceBindings({});
        expect(result).toEqual({
            sjekklistekrav: {
                trueText: "resource.trueText.default",
                falseText: "resource.falseText.default",
                defaultText: "resource.emptyFieldText.default",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        });
    });

    it("getResourceBindings should use provided values", () => {
        const props = {
            resourceBindings: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                emptyFieldText: "none"
            }
        };
        const instance = new CustomGroupSjekklistekrav(props);
        const result = instance.getResourceBindings(props);
        expect(result).toEqual({
            sjekklistekrav: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                emptyFieldText: "none"
            }
        });
    });

    it('getResourceBindings should omit emptyFieldText if hideIfEmpty is "true"', () => {
        const props = {
            resourceBindings: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                emptyFieldText: "none"
            },
            hideIfEmpty: "true"
        };
        const instance = new CustomGroupSjekklistekrav(props);
        const result = instance.getResourceBindings(props);
        expect(result).toEqual({
            sjekklistekrav: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe"
            }
        });
    });
});
