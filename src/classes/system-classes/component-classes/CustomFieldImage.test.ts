import CustomFieldImage from "./CustomFieldImage.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";
import { getTextResourceFromResourceBinding } from "@arkitektum/altinn-studio-custom-components-utils";

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
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResourceFromResourceBinding: jest.fn((binding) => binding),
    hasValue: jest.fn((value) => value !== undefined && value !== null && value !== "")
}));

describe("CustomFieldImage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("uses the data binding value as the image source when present", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data:image/jpeg;base64,abc");
        const instance = new CustomFieldImage({ resourceBindings: { src: "resource.kartutsnitt.src" } });
        expect(instance.resourceValues.data).toBe("data:image/jpeg;base64,abc");
        expect(instance.isEmpty).toBe(false);
    });

    it("falls back to resourceBindings.src when there is no data value", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        const instance = new CustomFieldImage({ resourceBindings: { src: "kartutsnitt.jpg" } });
        // getTextResourceFromResourceBinding is mocked to echo the binding string.
        expect(instance.resourceValues.data).toBe("kartutsnitt.jpg");
        expect(instance.isEmpty).toBe(false);
    });

    it("is empty when neither a data value nor a src resource is available", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
        (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValueOnce(undefined);
        const empty = new CustomFieldImage({ resourceBindings: { src: "" } });
        expect(empty.isEmpty).toBe(true);
    });

    it("resolves title and alt from resource bindings", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("kartutsnitt.jpg");
        const instance = new CustomFieldImage({
            resourceBindings: { title: "resource.kartutsnitt.title", alt: "resource.kartutsnitt.alt" }
        });
        expect(instance.resourceValues.title).toBe("resource.kartutsnitt.title");
        expect(instance.alt).toBe("resource.kartutsnitt.alt");
    });
});
