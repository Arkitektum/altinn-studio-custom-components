import CustomGrouplistEttersending from "./CustomGrouplistEttersending";

// Mocks
const mockGetComponentDataValue = jest.fn();
const mockGetComponentResourceValue = jest.fn();
const mockHasValue = jest.fn();
const mockGetTextResources = jest.fn();
const mockHasMissingTextResources = jest.fn();

jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: (...args) => mockGetComponentDataValue(...args),
    getComponentResourceValue: (...args) => mockGetComponentResourceValue(...args),
    getTextResources: () => mockGetTextResources(),
    hasValue: (data) => mockHasValue(data)
}));

jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: (...args) => mockHasMissingTextResources(...args)
}));

// Dummy CustomComponent base class
class CustomComponent {
    constructor(props) {
        this.props = props;
    }
}

describe("CustomGrouplistEttersending", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true and resourceValues.data to emptyFieldText when data is empty", () => {
        mockGetComponentDataValue.mockReturnValue(undefined);
        mockHasValue.mockReturnValue(false);
        mockGetComponentResourceValue.mockReturnValue("Empty text");

        const props = { some: "prop" };
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty text");
        expect(mockGetComponentResourceValue).toHaveBeenCalledWith(props, "emptyFieldText");
    });

    it("should set isEmpty to false and resourceValues.data to data when data is present", () => {
        mockGetComponentDataValue.mockReturnValue("Some data");
        mockHasValue.mockReturnValue(true);

        const props = { some: "prop" };
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("Some data");
    });

    it("hasContent should return result of hasValue", () => {
        mockHasValue.mockReturnValue(true);
        const instance = new CustomGrouplistEttersending({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(mockHasValue).toHaveBeenCalledWith("abc");
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        mockGetTextResources.mockReturnValue(["resource1", "resource2"]);
        mockHasMissingTextResources.mockReturnValue(["missing1"]);
        const instance = new CustomGrouplistEttersending({});
        const result = instance.getValidationMessages({ some: "binding" });

        expect(mockGetTextResources).toHaveBeenCalled();
        expect(mockHasMissingTextResources).toHaveBeenCalledWith(["resource1", "resource2"], { some: "binding" });
        expect(result).toEqual(["missing1"]);
    });

    it("getValueFromFormData should call getComponentDataValue with props", () => {
        mockGetComponentDataValue.mockReturnValue("formValue");
        const props = { formData: "data" };
        const instance = new CustomGrouplistEttersending(props);
        const value = instance.getValueFromFormData(props);

        expect(mockGetComponentDataValue).toHaveBeenCalledWith(props);
        expect(value).toBe("formValue");
    });
});
