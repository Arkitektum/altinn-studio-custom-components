import CustomDispensasjonerListData from "./CustomDispensasjonerListData";
import CustomComponent from "../CustomComponent.js";
import * as helpers from "../../../functions/helpers.js";
import * as dataFormatHelpers from "../../../functions/dataFormatHelpers.js";

jest.mock("../../../functions/helpers.js");
jest.mock("../../../functions/dataFormatHelpers.js");

describe("CustomDispensasjonerListData", () => {
    let props;

    beforeEach(() => {
        props = { some: "prop", format: "test-format" };
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomDispensasjonerListData(props);
        expect(instance).toBeInstanceOf(CustomComponent);
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        helpers.getComponentDataValue.mockReturnValue("someData");
        dataFormatHelpers.formatString.mockReturnValue("formattedData");
        helpers.hasValue.mockReturnValue(false);

        const instance = new CustomDispensasjonerListData(props);
        expect(instance.isEmpty).toBe(true);
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        helpers.getComponentDataValue.mockReturnValue("someData");
        dataFormatHelpers.formatString.mockReturnValue("formattedData");
        helpers.hasValue.mockReturnValue(true);

        const instance = new CustomDispensasjonerListData(props);
        expect(instance.isEmpty).toBe(false);
    });

    it("should set resourceValues.data to formatted data", () => {
        helpers.getComponentDataValue.mockReturnValue("someData");
        dataFormatHelpers.formatString.mockReturnValue("formattedData");
        helpers.hasValue.mockReturnValue(true);

        const instance = new CustomDispensasjonerListData(props);
        expect(instance.resourceValues.data).toBe("formattedData");
    });

    describe("hasContent", () => {
        it("should call hasValue with the given value", () => {
            helpers.hasValue.mockReturnValue(true);
            const instance = new CustomDispensasjonerListData(props);
            instance.hasContent("abc");
            expect(helpers.hasValue).toHaveBeenCalledWith("abc");
        });

        it("should return the result of hasValue", () => {
            helpers.hasValue.mockReturnValue(false);
            const instance = new CustomDispensasjonerListData(props);
            expect(instance.hasContent("xyz")).toBe(false);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and formatString with correct arguments", () => {
            helpers.getComponentDataValue.mockReturnValue("rawData");
            dataFormatHelpers.formatString.mockReturnValue("formattedData");
            const instance = new CustomDispensasjonerListData(props);

            const result = instance.getValueFromFormData(props);

            expect(helpers.getComponentDataValue).toHaveBeenCalledWith(props);
            expect(dataFormatHelpers.formatString).toHaveBeenCalledWith("rawData", "test-format");
            expect(result).toBe("formattedData");
        });
    });
});
