import CustomGrouplistAnsvarsomraadeType from "./CustomGrouplistAnsvarsomraadeType";
const { hasMissingTextResources } = require("../../../functions/validations.js");

// Mocks for global functions and CustomComponent
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn()
}));

const { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } = require("../../../functions/helpers.js");

// Dummy parent class
class CustomComponent {}

describe("CustomGrouplistAnsvarsomraadeType", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, resourceBindings, and resourceValues when data is present", () => {
            const props = { hideTitle: false };
            const groupedData = { key: [{ funksjon: { kodeverdi: "key" } }] };
            getComponentDataValue.mockReturnValue([{ funksjon: { kodeverdi: "key" } }]);
            hasValue.mockReturnValue(true);
            getComponentResourceValue.mockImplementation((p, k) => `resource_${k}`);

            const instance = new CustomGrouplistAnsvarsomraadeType(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceBindings).toHaveProperty("tiltaksklasse");
            expect(instance.resourceValues.title).toBe("resource_title");
            expect(instance.resourceValues.data).toEqual(groupedData);
        });

        it("should set isEmpty true and resourceValues.data to emptyFieldText when no data", () => {
            const props = { hideTitle: false };
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((p, k) => `resource_${k}`);

            const instance = new CustomGrouplistAnsvarsomraadeType(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("resource_emptyFieldText");
        });

        it("should set resourceValues.title to false when hideTitle is true", () => {
            const props = { hideTitle: true };
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((p, k) => `resource_${k}`);

            const instance = new CustomGrouplistAnsvarsomraadeType(props);

            expect(instance.resourceValues.title).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGrouplistAnsvarsomraadeType({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistAnsvarsomraadeType({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            getTextResources.mockReturnValue(["res1", "res2"]);
            hasMissingTextResources.mockReturnValue(["missing"]);
            const instance = new CustomGrouplistAnsvarsomraadeType({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should group array items by funksjon.kodeverdi", () => {
            const props = {};
            const data = [
                { funksjon: { kodeverdi: "A" }, value: 1 },
                { funksjon: { kodeverdi: "B" }, value: 2 },
                { funksjon: { kodeverdi: "A" }, value: 3 }
            ];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(true);

            const instance = new CustomGrouplistAnsvarsomraadeType(props);
            const grouped = instance.getValueFromFormData(props);

            expect(grouped).toEqual({
                A: [
                    { funksjon: { kodeverdi: "A" }, value: 1 },
                    { funksjon: { kodeverdi: "A" }, value: 3 }
                ],
                B: [{ funksjon: { kodeverdi: "B" }, value: 2 }]
            });
        });

        it("should return empty object if no value", () => {
            const props = {};
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);

            const instance = new CustomGrouplistAnsvarsomraadeType(props);
            const grouped = instance.getValueFromFormData(props);

            expect(grouped).toEqual({});
        });
    });

    describe("groupArrayItemsByFunksjon", () => {
        it("should group items by funksjon.kodeverdi", () => {
            hasValue.mockReturnValue(true);
            const array = [
                { funksjon: { kodeverdi: "X" }, foo: 1 },
                { funksjon: { kodeverdi: "Y" }, foo: 2 },
                { funksjon: { kodeverdi: "X" }, foo: 3 }
            ];
            const instance = new CustomGrouplistAnsvarsomraadeType({});
            const result = instance.groupArrayItemsByFunksjon(array);
            expect(result).toEqual({
                X: [
                    { funksjon: { kodeverdi: "X" }, foo: 1 },
                    { funksjon: { kodeverdi: "X" }, foo: 3 }
                ],
                Y: [{ funksjon: { kodeverdi: "Y" }, foo: 2 }]
            });
        });

        it("should skip items with missing kodeverdi", () => {
            hasValue.mockReturnValue(true);
            const array = [{ funksjon: { kodeverdi: "" }, foo: 1 }, { funksjon: {}, foo: 2 }, { foo: 3 }];
            const instance = new CustomGrouplistAnsvarsomraadeType({});
            const result = instance.groupArrayItemsByFunksjon(array);
            expect(result).toEqual({});
        });

        it("should return empty object if array is not valid", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistAnsvarsomraadeType({});
            expect(instance.groupArrayItemsByFunksjon(null)).toEqual({});
        });
    });

    describe("getResourceBindings", () => {
        it("should use default resource keys if not provided", () => {
            const props = {};
            const instance = new CustomGrouplistAnsvarsomraadeType(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.tiltaksklasse.title).toBe("resource.tiltaksklasse.title");
            expect(bindings.ansvarsomraade.title).toBe("resource.beskrivelseAvAnsvarsomraadet.title");
            expect(bindings.ansvarsfordeling.title).toBe("resource.ansvarsfordeling.title");
            expect(bindings.ansvarsfordeling.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use custom resource bindings if provided", () => {
            const props = {
                resourceBindings: {
                    tiltaksklasse: { title: "custom.tiltaksklasse", emptyFieldText: "custom.empty" },
                    title: "custom.ansvarsfordeling",
                    emptyFieldText: "custom.emptyFieldText"
                }
            };
            const instance = new CustomGrouplistAnsvarsomraadeType(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.tiltaksklasse.title).toBe("custom.tiltaksklasse");
            expect(bindings.tiltaksklasse.emptyFieldText).toBe("custom.empty");
            expect(bindings.ansvarsfordeling.title).toBe("custom.ansvarsfordeling");
            expect(bindings.ansvarsfordeling.emptyFieldText).toBe("custom.emptyFieldText");
        });

        it("should omit ansvarsfordeling.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomGrouplistAnsvarsomraadeType(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.ansvarsfordeling).not.toHaveProperty("title");
        });

        it("should omit ansvarsfordeling.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomGrouplistAnsvarsomraadeType(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.ansvarsfordeling).not.toHaveProperty("emptyFieldText");
        });
    });
});
