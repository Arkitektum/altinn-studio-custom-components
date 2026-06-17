import CustomFieldImage from "./CustomFieldImage";
import { getComponentDataValue } from "../../../functions/helpers.js";
import { getTextResourceFromResourceBinding } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {
        constructor() {}
    };
});
jest.mock("../../../functions/helpers.js", () => ({
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
        getComponentDataValue.mockReturnValue("data:image/jpeg;base64,abc");
        const instance = new CustomFieldImage({ resourceBindings: { src: "resource.kartutsnitt.src" } });
        expect(instance.resourceValues.data).toBe("data:image/jpeg;base64,abc");
        expect(instance.isEmpty).toBe(false);
    });

    it("falls back to resourceBindings.src when there is no data value", () => {
        getComponentDataValue.mockReturnValue(undefined);
        const instance = new CustomFieldImage({ resourceBindings: { src: "kartutsnitt.jpg" } });
        // getTextResourceFromResourceBinding is mocked to echo the binding string.
        expect(instance.resourceValues.data).toBe("kartutsnitt.jpg");
        expect(instance.isEmpty).toBe(false);
    });

    it("is empty when neither a data value nor a src resource is available", () => {
        getComponentDataValue.mockReturnValue(undefined);
        getTextResourceFromResourceBinding.mockReturnValueOnce(undefined);
        const empty = new CustomFieldImage({ resourceBindings: { src: "" } });
        expect(empty.isEmpty).toBe(true);
    });

    it("resolves title and alt from resource bindings", () => {
        getComponentDataValue.mockReturnValue("kartutsnitt.jpg");
        const instance = new CustomFieldImage({
            resourceBindings: { title: "resource.kartutsnitt.title", alt: "resource.kartutsnitt.alt" }
        });
        expect(instance.resourceValues.title).toBe("resource.kartutsnitt.title");
        expect(instance.alt).toBe("resource.kartutsnitt.alt");
    });
});
