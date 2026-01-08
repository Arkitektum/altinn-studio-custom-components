import CustomGroupRammebetingelserTilknytninger from "./CustomGroupRammebetingelserTilknytninger";
import CustomComponent from "../CustomComponent";
import RammebetingelserTilknytninger from "../../data-classes/RammebetingelserTilknytninger";

// Mock helpers and validations
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomGroupRammebetingelserTilknytninger", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getTextResources.mockReturnValue(["res1", "res2"]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `text:${key}`);
        hasValue.mockImplementation((val) => val !== undefined && val !== null && val !== "" && val !== false);
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        RammebetingelserTilknytninger.prototype.__mocked = true;
    });

    it("should call super and initialize properties correctly with non-empty data", () => {
        const props = { resourceBindings: {}, resourceValues: {} };
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockReturnValue(true);

        const instance = new CustomGroupRammebetingelserTilknytninger(props);

        expect(instance instanceof CustomComponent).toBe(true);
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toBeUndefined();
        expect(!!instance.hasValidationMessages).toBe(false);
        expect(instance.resourceBindings).toBeDefined();
        expect(instance.resourceValues.data).toEqual(
            expect.objectContaining({ __mocked: true, adkomst: undefined, avloep: undefined, overvann: undefined, vannforsyning: undefined })
        );
    });

    it("should set isEmpty true and use emptyFieldText when data is empty", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `empty:${key}`);

        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty:resource.emptyFieldText.default");
    });

    it("should set resourceValues.title from props.resourceValues.title if provided", () => {
        const props = { resourceBindings: {}, resourceValues: { title: "Custom Title" } };
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockImplementation((val) => val !== undefined && val !== null && val !== "" && val !== false);

        const instance = new CustomGroupRammebetingelserTilknytninger(props);

        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("should set resourceValues.title from resource binding if props.resourceValues.title is not provided", () => {
        const props = { resourceBindings: { title: "custom.title" }, resourceValues: {} };
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockImplementation((val) => val !== undefined && val !== null && val !== "" && val !== false);

        const instance = new CustomGroupRammebetingelserTilknytninger(props);

        expect(instance.resourceValues.title).toBe("text:custom.title");
    });

    it("should set resourceValues.data to emptyFieldText if data is empty", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `empty:${key}`);

        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.resourceValues.data).toBe("empty:resource.emptyFieldText.default");
    });

    it("should set resourceValues.data to data if not empty", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockReturnValue(true);

        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.resourceValues.data).toEqual(
            expect.objectContaining({ __mocked: true, adkomst: undefined, avloep: undefined, overvann: undefined, vannforsyning: undefined })
        );
    });

    it("should set hasValidationMessages to true if hasValidationMessages returns true", () => {
        hasValidationMessages.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should set hasValidationMessages to false if hasValidationMessages returns false", () => {
        hasValidationMessages.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue([]);
        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.hasValidationMessages).toBe(false);
    });

    it("should set validationMessages to result of getValidationMessages", () => {
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.validationMessages).toEqual(["missing"]);
    });

    it("should set resourceBindings to result of getResourceBindings", () => {
        const instance = new CustomGroupRammebetingelserTilknytninger({});
        expect(instance.resourceBindings).toBeDefined();
        expect(instance.resourceBindings.rammebetingelserTilknytninger).toBeDefined();
    });

    it("should handle undefined props gracefully", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => `empty:${key}`);

        const instance = new CustomGroupRammebetingelserTilknytninger();
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty:resource.emptyFieldText.default");
    });
});
