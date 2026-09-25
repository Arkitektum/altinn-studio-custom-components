import type { ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGrouplistSjekklistekrav from "./CustomGrouplistSjekklistekrav.ts";
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
    return function Sjekklistekrav(this: Record<string, unknown>, data: unknown) {
        this.mockData = data;
    };
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

describe("CustomGrouplistSjekklistekrav", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("empty");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ id: 1 }]);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => key);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);

        expect(instance.isEmpty).toBe(false);
        expect(Array.isArray(instance.resourceValues.data)).toBe(true);
    });

    it("should call getValidationMessages and set validationMessages", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ id: 1 }]);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("title");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);

        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getValueFromFormData should return array of Sjekklistekrav instances", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ foo: "bar" }, { baz: "qux" }]);
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        const result = instance.getValueFromFormData(props) as { mockData?: unknown }[];

        expect(result).toHaveLength(2);
        expect(result[0]!.mockData).toEqual({ foo: "bar" });
        expect(result[1]!.mockData).toEqual({ baz: "qux" });
    });

    it("getResourceBindings should use default values if not provided", () => {
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.trueText).toBe("resource.trueText.default");
        expect(bindings.sjekklistekrav.falseText).toBe("resource.falseText.default");
        expect(bindings.sjekklistekrav.defaultText).toBe("resource.emptyFieldText.default");
        expect(bindings.sjekklistekrav.title).toBe("resource.krav.sjekklistekrav.title");
        expect(bindings.sjekklistekrav.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("getResourceBindings should override values from props.resourceBindings", () => {
        const props = {
            resourceBindings: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                title: "My Title",
                emptyFieldText: "Nothing here"
            }
        };
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.trueText).toBe("yes");
        expect(bindings.sjekklistekrav.falseText).toBe("no");
        expect(bindings.sjekklistekrav.defaultText).toBe("maybe");
        expect(bindings.sjekklistekrav.title).toBe("My Title");
        expect(bindings.sjekklistekrav.emptyFieldText).toBe("Nothing here");
    });

    it("getResourceBindings should hide title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.title).toBeUndefined();
    });

    it("getResourceBindings should hide emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.emptyFieldText).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(result).toEqual(["missing"]);
    });
});
