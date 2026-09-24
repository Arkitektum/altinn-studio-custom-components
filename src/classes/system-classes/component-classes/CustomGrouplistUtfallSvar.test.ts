import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGrouplistUtfallSvar from "./CustomGrouplistUtfallSvar.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

// Mocks for dependencies
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

describe("CustomGrouplistUtfallSvar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true when data has no value", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `text:${key}`);
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.title).toBe("text:titleKey");
        expect(instance.resourceValues.data).toBe("text:emptyFieldKey");
    });

    it("should set isEmpty to false when data has value", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("someData");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `text:${key}`);
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("someData");
    });

    it("should hide title if hideTitle is true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("someData");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `text:${key}`);
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            },
            hideTitle: true
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.resourceValues.title).toBe("text:undefined");
    });

    it("should use default emptyFieldText if not provided and hideIfEmpty is not true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `text:${key}`);
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.resourceValues.data).toBe("text:resource.emptyFieldText.default");
    });

    it("should not set emptyFieldText if hideIfEmpty is true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `text:${key}`);
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            },
            hideIfEmpty: true
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.resourceValues.data).toBe("text:undefined");
    });

    it("should call hasValidationMessages and set validationMessages", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("someData");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `text:${key}`);
        (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1", "resource2"]);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missingKey"]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {
            resourceBindings: {
                title: "titleKey",
                emptyFieldText: "emptyFieldKey"
            }
        };

        const instance = new CustomGrouplistUtfallSvar(props);

        expect(instance.validationMessages).toEqual(["missingKey"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomGrouplistUtfallSvar({});
            expect(instance.hasContent("data")).toBe(true);

            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1"]);
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);
            const instance = new CustomGrouplistUtfallSvar({});
            const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue with props", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue("value");
            const instance = new CustomGrouplistUtfallSvar({});
            const result = instance.getValueFromFormData({ foo: "bar" } as unknown as ComponentProps) as unknown[];
            expect(getComponentDataValue).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toBe("value");
        });
    });

    describe("getResourceBindings", () => {
        it("should include title and emptyFieldText when not hidden", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyFieldKey"
                }
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar!.title).toBe("titleKey");
            expect(result.utfallSvar!.emptyFieldText).toBe("emptyFieldKey");
        });

        it("should not include title when hideTitle is true", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {
                    title: "titleKey"
                },
                hideTitle: true
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar!.title).toBeUndefined();
        });

        it("should use default emptyFieldText when not provided", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {}
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar!.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should not include emptyFieldText when hideIfEmpty is true", () => {
            const instance = new CustomGrouplistUtfallSvar({});
            const props = {
                resourceBindings: {
                    emptyFieldText: "emptyFieldKey"
                },
                hideIfEmpty: true
            };
            const result = instance.getResourceBindings(props);
            expect(result.utfallSvar!.emptyFieldText).toBeUndefined();
        });
    });
});
