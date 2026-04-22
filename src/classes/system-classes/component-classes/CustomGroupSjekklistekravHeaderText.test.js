import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import CustomComponent from "../CustomComponent";
import CustomGroupSjekklistekravHeaderText from "./CustomGroupSjekklistekravHeaderText";

// Mock the utility functions
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomGroupSjekklistekravHeaderText", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should extend CustomComponent", () => {
            const instance = new CustomGroupSjekklistekravHeaderText({});
            expect(instance).toBeInstanceOf(CustomComponent);
        });

        it("should initialize with empty props", () => {
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty field text");

            const instance = new CustomGroupSjekklistekravHeaderText({});

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceBindings).toEqual({});
            expect(instance.resourceValues).toEqual({
                data: "Empty field text"
            });
        });

        it("should initialize with valid resource bindings when data has content", () => {
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValueOnce("Checklist item").mockReturnValueOnce("Checklist answer");

            const props = {
                resourceBindings: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: "answer_binding"
                }
            };

            const instance = new CustomGroupSjekklistekravHeaderText(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceBindings).toEqual({
                sjekklistepunkt: "item_binding",
                sjekklistepunktsvar: "answer_binding"
            });
            expect(instance.resourceValues).toEqual({
                data: {
                    sjekklistepunkt: "Checklist item",
                    sjekklistepunktsvar: "Checklist answer"
                }
            });
        });

        it("should handle empty resource bindings when data is empty", () => {
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding
                .mockReturnValueOnce(undefined) // sjekklistepunkt
                .mockReturnValueOnce(undefined) // sjekklistepunktsvar
                .mockReturnValueOnce("Empty text"); // emptyFieldText

            const props = {
                resourceBindings: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: "answer_binding"
                }
            };

            const instance = new CustomGroupSjekklistekravHeaderText(props);

            expect(instance.isEmpty).toBe(true);
            // The emptyFieldText call returns the mocked "Empty text"
            expect(instance.resourceValues.data).toBe("Empty text");
        });

        it("should handle missing resource bindings gracefully", () => {
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue(undefined);

            const instance = new CustomGroupSjekklistekravHeaderText({});

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceBindings).toEqual({});
            expect(instance.resourceValues.data).toBeUndefined();
        });
    });

    describe("hasContent", () => {
        it("should return true when data has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGroupSjekklistekravHeaderText({});

            const result = instance.hasContent("some data");

            expect(hasValue).toHaveBeenCalledWith("some data");
            expect(result).toBe(true);
        });

        it("should return false when data has no value", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGroupSjekklistekravHeaderText({});

            const result = instance.hasContent("");

            expect(hasValue).toHaveBeenCalledWith("");
            expect(result).toBe(false);
        });

        it("should handle null and undefined data", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGroupSjekklistekravHeaderText({});

            expect(instance.hasContent(null)).toBe(false);
            expect(instance.hasContent(undefined)).toBe(false);
            expect(hasValue).toHaveBeenCalledWith(null);
            expect(hasValue).toHaveBeenCalledWith(undefined);
        });
    });

    describe("getValueFromResourceBindings", () => {
        let instance;

        beforeEach(() => {
            // Create instance with minimal mocking to avoid interference
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue(undefined);
            instance = new CustomGroupSjekklistekravHeaderText({});
            jest.clearAllMocks(); // Clear mocks after constructor is done
        });

        it("should extract values from valid resource bindings", () => {
            getTextResourceFromResourceBinding.mockReturnValueOnce("Item text").mockReturnValueOnce("Answer text");

            const resourceBindings = {
                sjekklistekravHeader: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: "answer_binding"
                }
            };

            const result = instance.getValueFromResourceBindings(resourceBindings);

            expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("item_binding");
            expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("answer_binding");
            expect(result).toEqual({
                sjekklistepunkt: "Item text",
                sjekklistepunktsvar: "Answer text"
            });
        });

        it("should handle missing resource bindings", () => {
            getTextResourceFromResourceBinding.mockReturnValue(undefined);

            const result = instance.getValueFromResourceBindings({});

            expect(result).toEqual({
                sjekklistepunkt: undefined,
                sjekklistepunktsvar: undefined
            });
        });

        it("should handle undefined resource bindings", () => {
            getTextResourceFromResourceBinding.mockReturnValue(undefined);

            const result = instance.getValueFromResourceBindings(undefined);

            expect(result).toEqual({
                sjekklistepunkt: undefined,
                sjekklistepunktsvar: undefined
            });
        });

        it("should handle partial resource bindings", () => {
            getTextResourceFromResourceBinding.mockReturnValueOnce("Item text").mockReturnValueOnce(undefined);

            const resourceBindings = {
                sjekklistekravHeader: {
                    sjekklistepunkt: "item_binding"
                    // sjekklistepunktsvar is missing
                }
            };

            const result = instance.getValueFromResourceBindings(resourceBindings);

            expect(result).toEqual({
                sjekklistepunkt: "Item text",
                sjekklistepunktsvar: undefined
            });
        });
    });

    describe("getResourceBindings", () => {
        it("should extract resource bindings from props", () => {
            const instance = new CustomGroupSjekklistekravHeaderText({});
            const props = {
                resourceBindings: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: "answer_binding",
                    otherProperty: "should_be_ignored"
                }
            };

            const result = instance.getResourceBindings(props);

            expect(result).toEqual({
                sjekklistekravHeader: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: "answer_binding"
                }
            });
        });

        it("should handle missing resource bindings in props", () => {
            const instance = new CustomGroupSjekklistekravHeaderText({});
            const props = {};

            const result = instance.getResourceBindings(props);

            expect(result).toEqual({
                sjekklistekravHeader: {
                    sjekklistepunkt: undefined,
                    sjekklistepunktsvar: undefined
                }
            });
        });

        it("should handle undefined props", () => {
            const instance = new CustomGroupSjekklistekravHeaderText({});

            const result = instance.getResourceBindings(undefined);

            expect(result).toEqual({
                sjekklistekravHeader: {
                    sjekklistepunkt: undefined,
                    sjekklistepunktsvar: undefined
                }
            });
        });

        it("should handle partial resource bindings in props", () => {
            const instance = new CustomGroupSjekklistekravHeaderText({});
            const props = {
                resourceBindings: {
                    sjekklistepunkt: "item_binding"
                    // sjekklistepunktsvar is missing
                }
            };

            const result = instance.getResourceBindings(props);

            expect(result).toEqual({
                sjekklistekravHeader: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: undefined
                }
            });
        });
    });

    describe("getComponentUsage", () => {
        it("should return array with custom-field component", () => {
            const instance = new CustomGroupSjekklistekravHeaderText({});

            const result = instance.getComponentUsage();

            expect(result).toEqual(["custom-field"]);
        });

        it("should always return the same component usage", () => {
            const instance1 = new CustomGroupSjekklistekravHeaderText({});
            const instance2 = new CustomGroupSjekklistekravHeaderText({ someProps: "value" });

            expect(instance1.getComponentUsage()).toEqual(["custom-field"]);
            expect(instance2.getComponentUsage()).toEqual(["custom-field"]);
        });
    });

    describe("integration scenarios", () => {
        it("should handle complete workflow with valid data", () => {
            hasValue.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValueOnce("Complete item").mockReturnValueOnce("Complete answer");

            const props = {
                resourceBindings: {
                    sjekklistepunkt: "item_binding",
                    sjekklistepunktsvar: "answer_binding"
                }
            };

            const instance = new CustomGroupSjekklistekravHeaderText(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.getComponentUsage()).toEqual(["custom-field"]);
            expect(instance.resourceValues.data).toEqual({
                sjekklistepunkt: "Complete item",
                sjekklistepunktsvar: "Complete answer"
            });
        });

        it("should handle complete workflow with empty data", () => {
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("No data available");

            const props = {
                resourceBindings: {
                    sjekklistekravHeader: {
                        emptyFieldText: "empty_text"
                    }
                }
            };

            const instance = new CustomGroupSjekklistekravHeaderText(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.getComponentUsage()).toEqual(["custom-field"]);
            expect(instance.resourceValues.data).toBe("No data available");
        });
    });
});
