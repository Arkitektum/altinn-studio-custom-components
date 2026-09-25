import type { ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGroupLoefteinnretninger from "./CustomGroupLoefteinnretninger.ts";
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

describe("CustomGroupLoefteinnretninger", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data has no content", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(null);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("empty");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty");
    });

    it("should set isEmpty to false if data has content", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("someData");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("title");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toEqual({ mockData: "someData" });
    });

    it("should use resourceValues.title from props if present and hasValue returns true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        (hasValue as unknown as jest.Mock).mockImplementation((val) => val === "customTitle");
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("fallbackTitle");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = { resourceValues: { title: "customTitle" } };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceValues.title).toBe("customTitle");
    });

    it("should fallback to resourceBinding title if resourceValues.title is not present", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("fallbackTitle");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("resource.rammebetingelser.loefteinnretninger.title");
        expect(instance.resourceValues.title).toBe("fallbackTitle");
    });

    it("should call getValidationMessages and set validationMessages and hasValidationMessages", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("title");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["msg1"]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.validationMessages).toEqual(["msg1"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getResourceBindings should omit loefteinnretninger.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceBindings.loefteinnretninger?.title).toBeUndefined();
    });

    it("getResourceBindings should omit loefteinnretninger.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceBindings.loefteinnretninger?.emptyFieldText).toBeUndefined();
    });

    it("getResourceBindings should use custom resourceBindings if provided", () => {
        const props = {
            resourceBindings: {
                planleggesHeis: { title: "custom.heis.title" },
                title: "custom.main.title",
                emptyFieldText: "custom.empty.text"
            }
        };
        const instance = new CustomGroupLoefteinnretninger(props);

        expect(instance.resourceBindings.planleggesHeis!.title).toBe("custom.heis.title");
        expect(instance.resourceBindings.loefteinnretninger!.title).toBe("custom.main.title");
        expect(instance.resourceBindings.loefteinnretninger!.emptyFieldText).toBe("custom.empty.text");
    });

    it("hasContent should delegate to hasValue", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const instance = new CustomGroupLoefteinnretninger({});
        expect(instance.hasContent("abc")).toBe(true);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        (getTextResources as unknown as jest.Mock).mockReturnValue("resources");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);
        const instance = new CustomGroupLoefteinnretninger({});
        const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(result).toEqual(["missing"]);
    });

    it("getValueFromFormData should return Loefteinnretninger instance", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        const instance = new CustomGroupLoefteinnretninger({});
        const result = instance.getValueFromFormData({});
        expect(result).toEqual({ mockData: "data" });
    });
});
