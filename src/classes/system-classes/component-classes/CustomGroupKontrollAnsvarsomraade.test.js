import CustomGroupKontrollAnsvarsomraade from "./CustomGroupKontrollAnsvarsomraade";
import CustomComponent from "../CustomComponent.js";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.js";
import * as helpers from "../../../functions/helpers.js";
import * as validations from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js");
jest.mock("../../data-classes/KontrollAnsvarsomraade.js");
jest.mock("../../../functions/helpers.js");
jest.mock("../../../functions/validations.js");

describe("CustomGroupKontrollAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true and use emptyFieldText when data is empty", () => {
            helpers.getComponentDataValue.mockReturnValue(undefined);
            helpers.hasValue.mockReturnValue(false);
            helpers.getTextResourceFromResourceBinding.mockReturnValue("Empty Field");
            validations.hasMissingTextResources.mockReturnValue([]);
            validations.hasValidationMessages.mockReturnValue(false);

            const props = {
                formData: {},
                resourceBindings: {
                    ansvarsomraade: { emptyFieldText: "emptyFieldTextKey" }
                }
            };

            // Mock KontrollAnsvarsomraade constructor to return a dummy object
            KontrollAnsvarsomraade.mockImplementation(() => ({}));

            const instance = new CustomGroupKontrollAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty Field");
            expect(helpers.getTextResourceFromResourceBinding).toHaveBeenCalledWith("emptyFieldTextKey");
        });

        it("should set isEmpty to false and use data when data is present", () => {
            const kontrollInstance = { kontrollerende: "test" };
            helpers.getComponentDataValue.mockReturnValue({ kontrollerende: "test" });
            helpers.hasValue.mockReturnValue(true);
            validations.hasMissingTextResources.mockReturnValue([]);
            validations.hasValidationMessages.mockReturnValue(false);

            KontrollAnsvarsomraade.mockImplementation(() => kontrollInstance);

            const props = {
                formData: { kontrollerende: "test" },
                resourceBindings: {}
            };

            const instance = new CustomGroupKontrollAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toBe(kontrollInstance);
        });

        it("should set validationMessages and hasValidationMessages correctly", () => {
            helpers.getComponentDataValue.mockReturnValue(undefined);
            helpers.hasValue.mockReturnValue(false);
            helpers.getTextResourceFromResourceBinding.mockReturnValue("Empty Field");
            validations.hasMissingTextResources.mockReturnValue(["Missing"]);
            validations.hasValidationMessages.mockReturnValue(true);

            KontrollAnsvarsomraade.mockImplementation(() => ({}));

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
            helpers.hasValue.mockReturnValue(true);
            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const data = { foo: "bar" };
            instance.hasContent(data);
            expect(helpers.hasValue).toHaveBeenCalledWith(data);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with resourceBindings", () => {
            validations.hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const resourceBindings = { foo: "bar" };
            const result = instance.getValidationMessages(resourceBindings);
            expect(validations.hasMissingTextResources).toHaveBeenCalledWith(resourceBindings);
            expect(result).toEqual(["msg"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return KontrollAnsvarsomraade instance", () => {
            const data = { kontrollerende: "test" };
            helpers.getComponentDataValue.mockReturnValue(data);
            const kontrollInstance = { kontrollerende: "test" };
            KontrollAnsvarsomraade.mockImplementation(() => kontrollInstance);

            const instance = new CustomGroupKontrollAnsvarsomraade({});
            const props = { formData: data };
            const resourceBindings = { foo: "bar" };

            const result = instance.getValueFromFormData(props, resourceBindings);

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
