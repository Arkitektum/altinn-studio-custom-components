import CustomFieldData from "./CustomFieldData";
import { getComponentDataTitle, getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataTitle: jest.fn(),
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/dataFormatHelpers.js", () => ({
    formatString: jest.fn()
}));

describe("CustomFieldData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set resourceValues.data to formatted data when data is present", () => {
        getComponentDataValue.mockReturnValue("rawData");
        formatString.mockReturnValue("formattedData");
        hasValue.mockImplementation((val) => val !== "" && val !== undefined && val !== null);
        getComponentDataTitle.mockReturnValue("MyTitle");
        getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings?.[key]);

        const props = {
            format: "uppercase",
            resourceBindings: {
                emptyFieldText: "No data",
                title: "ResourceTitle"
            }
        };

        const instance = new CustomFieldData(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("formattedData");
        expect(instance.resourceValues.title).toBe("MyTitle");
    });

    it("should set resourceValues.data to emptyFieldText when data is empty", () => {
        getComponentDataValue.mockReturnValue("");
        formatString.mockReturnValue("");
        hasValue.mockReturnValue(false);
        getComponentDataTitle.mockReturnValue("");
        getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings?.[key]);

        const props = {
            resourceBindings: {
                emptyFieldText: "No data",
                title: "ResourceTitle"
            }
        };

        const instance = new CustomFieldData(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("No data");
        expect(instance.resourceValues.title).toBe("ResourceTitle");
    });

    it("should hide title if hideTitle is true", () => {
        getComponentDataValue.mockReturnValue("value");
        formatString.mockReturnValue("value");
        hasValue.mockReturnValue(true);
        getComponentDataTitle.mockReturnValue("SomeTitle");
        getComponentResourceValue.mockImplementation((props, key) => props.resourceBindings?.[key]);

        const props = {
            hideTitle: true,
            resourceBindings: {
                emptyFieldText: "No data",
                title: "ResourceTitle"
            }
        };

        const instance = new CustomFieldData(props);

        expect(instance.resourceValues.title).toBe(false);
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomFieldData({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValueFromFormData should format the value", () => {
        getComponentDataValue.mockReturnValue("raw");
        formatString.mockReturnValue("formatted");
        const instance = new CustomFieldData({});
        expect(instance.getValueFromFormData({ format: "test" })).toBe("formatted");
        expect(getComponentDataValue).toHaveBeenCalled();
        expect(formatString).toHaveBeenCalledWith("raw", "test");
    });
});
