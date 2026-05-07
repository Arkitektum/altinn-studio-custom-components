import CustomGroupDispensasjonOversikt from "./CustomGroupDispensasjonOversikt";
import DispensasjonOversikt from "../../data-classes/DispensasjonOversikt";

jest.mock("../../data-classes/DispensasjonOversikt");

const mockGetTextResourceFromResourceBinding = jest.fn();
let mockHasValueImpl = (v) => v !== undefined && v !== null && v !== "";
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResourceFromResourceBinding: (...args) => mockGetTextResourceFromResourceBinding(...args),
    hasValue: jest.fn((v) => mockHasValueImpl(v))
}));

const mockHasMissingTextResources = jest.fn();
const mockHasValidationMessages = jest.fn();
const mockGetComponentDataValue = jest.fn();
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: (...args) => mockHasMissingTextResources(...args),
    hasValidationMessages: (...args) => mockHasValidationMessages(...args)
}));
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: (...args) => mockGetComponentDataValue(...args)
}));

describe("CustomGroupDispensasjonOversikt", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        DispensasjonOversikt.mockClear();
    });

    it("should initialize with default resource bindings and values", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        mockGetTextResourceFromResourceBinding.mockReturnValue("defaultText");

        const instance = new CustomGroupDispensasjonOversikt({});
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toEqual([]);
        expect(instance.hasValidationMessages).toBe(false);
        expect(instance.resourceBindings).toBeDefined();
        expect(instance.resourceValues.title).toBe("defaultText");
        expect(instance.resourceValues.data).toEqual({ data: "mockData" });
    });

    it("should set isEmpty true and use emptyFieldText if no data", () => {
        mockGetComponentDataValue.mockReturnValue(undefined);
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        mockGetTextResourceFromResourceBinding.mockReturnValue("emptyText");
        // Simulate hasValue returning false for the DispensasjonOversikt instance
        mockHasValueImpl = () => false;

        const instance = new CustomGroupDispensasjonOversikt({});
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("emptyText");
        // Restore default for other tests
        mockHasValueImpl = (v) => v !== undefined && v !== null && v !== "";
    });

    it("should use provided resourceValues.title if present", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        const instance = new CustomGroupDispensasjonOversikt({
            resourceValues: { title: "CustomTitle" }
        });
        expect(instance.resourceValues.title).toBe("CustomTitle");
    });

    it("should call hasMissingTextResources and hasValidationMessages", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue(["Missing"]);
        mockHasValidationMessages.mockReturnValue(true);
        const instance = new CustomGroupDispensasjonOversikt({});
        expect(mockHasMissingTextResources).toHaveBeenCalled();
        expect(mockHasValidationMessages).toHaveBeenCalledWith(["Missing"]);
        expect(instance.validationMessages).toEqual(["Missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should set resourceBindings.dispensasjonOversikt.title if hideTitle is not true", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        const instance = new CustomGroupDispensasjonOversikt({});
        expect(instance.resourceBindings.dispensasjonOversikt.title).toBeDefined();
    });

    it("should not set resourceBindings.dispensasjonOversikt.title if hideTitle is true", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        const instance = new CustomGroupDispensasjonOversikt({ hideTitle: true });
        expect(instance.resourceBindings.dispensasjonOversikt?.title).toBeUndefined();
    });

    it("should set resourceBindings.dispensasjonOversikt.emptyFieldText if hideIfEmpty is not true", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        const instance = new CustomGroupDispensasjonOversikt({});
        expect(instance.resourceBindings.dispensasjonOversikt.emptyFieldText).toBeDefined();
    });

    it("should not set resourceBindings.dispensasjonOversikt.emptyFieldText if hideIfEmpty is true", () => {
        mockGetComponentDataValue.mockReturnValue("mockData");
        DispensasjonOversikt.mockImplementation((data) => ({ data }));
        mockHasMissingTextResources.mockReturnValue([]);
        mockHasValidationMessages.mockReturnValue(false);
        const instance = new CustomGroupDispensasjonOversikt({ hideIfEmpty: true });
        expect(instance.resourceBindings.dispensasjonOversikt?.emptyFieldText).toBeUndefined();
    });

    it("getComponentUsage returns expected array", () => {
        const instance = new CustomGroupDispensasjonOversikt({});
        expect(instance.getComponentUsage()).toEqual([
            "custom-feedbacklist-validation-messages",
            "custom-field-count-data",
            "custom-header-text",
            "custom-paragraph",
            "custom-table-data"
        ]);
    });
});
