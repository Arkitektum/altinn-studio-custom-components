import type { ResourceBindingGroup } from "../../../types.ts";

import * as helpers from "../../../functions/helpers.ts";
import * as validations from "../../../functions/validations.ts";
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import CustomGroupKontrollAnsvarsomraade from "./CustomGroupKontrollAnsvarsomraade.ts";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.ts";

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
jest.mock("../../data-classes/KontrollAnsvarsomraade.ts");
jest.mock("../../../functions/helpers.ts");
jest.mock("../../../functions/validations.ts");
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
}));
describe("CustomGroupKontrollAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true and use emptyFieldText when data is empty", () => {
            (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty Field");
            (validations.hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
            (validations.hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

            const props = {
                formData: {},
                resourceBindings: {
                    ansvarsomraade: { emptyFieldText: "emptyFieldTextKey" }
                }
            };

            // Mock KontrollAnsvarsomraade constructor to return a dummy object
            (KontrollAnsvarsomraade as unknown as jest.Mock).mockImplementation(() => ({}));

            const instance = new CustomGroupKontrollAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty Field");
            expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("emptyFieldTextKey");
        });

        it("should set isEmpty to false and use data when data is present", () => {
            const kontrollInstance = { kontrollerende: "test" };
            (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue({ kontrollerende: "test" });
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (validations.hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
            (validations.hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

            (KontrollAnsvarsomraade as unknown as jest.Mock).mockImplementation(() => kontrollInstance);

            const props = {
                formData: { kontrollerende: "test" },
                resourceBindings: {}
            };

            const instance = new CustomGroupKontrollAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toBe(kontrollInstance);
        });

        it("should set validationMessages and hasValidationMessages correctly", () => {
            (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty Field");
            (validations.hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["Missing"]);
            (validations.hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

            (KontrollAnsvarsomraade as unknown as jest.Mock).mockImplementation(() => ({}));

            const props = {
                formData: {},
                resourceBindings: {}
            };

            const instance = new CustomGroupKontrollAnsvarsomraade(props);

            expect(instance.validationMessages).toEqual(["Missing"]);
            expect(instance.hasValidationMessages).toBe(true);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue with data", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const data = { foo: "bar" };
            instance.hasContent(data);
            expect(hasValue).toHaveBeenCalledWith(data);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with resourceBindings", () => {
            (validations.hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["msg"]);
            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const resourceBindings = { foo: "bar" } as unknown as Record<string, ResourceBindingGroup>;
            const result = instance.getValidationMessages(resourceBindings);
            expect(validations.hasMissingTextResources).toHaveBeenCalledWith(resourceBindings);
            expect(result).toEqual(["msg"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return KontrollAnsvarsomraade instance", () => {
            const data = { kontrollerende: "test" };
            (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            const kontrollInstance = { kontrollerende: "test" };
            (KontrollAnsvarsomraade as unknown as jest.Mock).mockImplementation(() => kontrollInstance);

            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const props = { formData: data };
            const resourceBindings = { foo: "bar" };

            const result = instance.getValueFromFormData(props, resourceBindings as unknown as Record<string, ResourceBindingGroup>);

            expect(KontrollAnsvarsomraade).toHaveBeenCalledWith(data, resourceBindings);
            expect(result).toBe(kontrollInstance);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings when none are provided", () => {
            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const result = instance.getResourceBindings({});
            expect(result.funksjon.title).toBe("resource.funksjon.title");
            expect(result.funksjon.emptyFieldText).toBe("resource.emptyFieldText.default");
            expect(result.ansvarsomraade.title).toBe("resource.ansvarsomraade.title");
        });

        it("should override resource bindings when provided in props", () => {
            const props = {
                resourceBindings: {
                    funksjon: { title: "custom.funksjon.title", emptyFieldText: "custom.empty" },
                    ansvarsomraade: { title: "custom.ansvarsomraade.title" }
                }
            };
            const instance = new CustomGroupKontrollAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.funksjon.title).toBe("custom.funksjon.title");
            expect(result.funksjon.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsomraade.title).toBe("custom.ansvarsomraade.title");
        });
    });
});
