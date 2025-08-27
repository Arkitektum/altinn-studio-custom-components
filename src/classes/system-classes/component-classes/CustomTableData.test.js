import CustomTableData from "./CustomTableData";
import { getComponentDataValue, getRowNumberTitle, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getRowNumberTitle: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/tableHelpers.js", () => ({
    getTableHeaders: jest.fn(),
    getTableRows: jest.fn()
}));
jest.mock("../../../functions/componentHelpers.js", () => ({
    instantiateComponent: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasValidationMessages: jest.fn(),
    validateTableHeadersTextResourceBindings: jest.fn()
}));

describe("CustomTableData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, and resourceValues correctly when table is empty", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyTextKey"
                },
                tableColumns: []
            };
            getComponentDataValue.mockReturnValue({});
            hasValue.mockReturnValue(false);
            validateTableHeadersTextResourceBindings.mockReturnValue(["msg"]);
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);

            // Ensure tableColumns is always an array
            const safeProps = { ...props, tableColumns: Array.isArray(props.tableColumns) ? props.tableColumns : [] };
            const instance = new CustomTableData(safeProps);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toEqual(["msg"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toBe("resource:emptyTextKey");
        });

        it("should set resourceValues.data to table data when not empty", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyTextKey"
                },
                tableColumns: [{ header: "A" }]
            };
            const tableData = { tableHeaders: ["A"], tableRows: [[1]] };
            getComponentDataValue.mockReturnValue([1]);
            hasValue.mockReturnValue(true);
            validateTableHeadersTextResourceBindings.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);

            // getValueFromFormData returns tableData
            CustomTableData.prototype.getValueFromFormData = jest.fn().mockReturnValue(tableData);

            const instance = new CustomTableData(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toBe(tableData);
        });
    });

    describe("getTableHeadersFromProps", () => {
        it("should return empty array if no tableColumns", () => {
            const instance = new CustomTableData({});
            const result = instance.getTableHeadersFromProps({});
            expect(result).toEqual([]);
        });

        it("should return headers from getTableHeaders", () => {
            getTableHeaders.mockReturnValue([{ text: "A" }]);
            const props = { tableColumns: [{ header: "A" }] };
            const instance = new CustomTableData({});
            const result = instance.getTableHeadersFromProps(props);
            expect(result).toEqual([{ text: "A" }]);
        });

        it("should prepend row number header if showRowNumbers is true", () => {
            getTableHeaders.mockReturnValue([{ text: "A" }]);
            getRowNumberTitle.mockReturnValue("Row #");
            const props = { tableColumns: [{ header: "A" }], showRowNumbers: true };
            const instance = new CustomTableData({});
            const result = instance.getTableHeadersFromProps(props);
            expect(result[0]).toEqual({ text: "Row #" });
        });
    });

    describe("getTableRowsFromProps", () => {
        it("should return rows from getTableRows and remove empty rows", () => {
            getTableRows.mockReturnValue([[{ value: 1 }], [{ value: 2 }]]);
            const instance = new CustomTableData({});
            instance.removeEmptyTableRows = jest.fn().mockReturnValue([[{ value: 1 }]]);
            const props = { tableColumns: [{ header: "A" }] };
            const result = instance.getTableRowsFromProps(props, [1]);
            expect(result).toEqual([[{ value: 1 }]]);
        });

        it("should add row numbers if showRowNumbers is true", () => {
            getTableRows.mockReturnValue([[{ value: 1 }], [{ value: 2 }]]);
            const instance = new CustomTableData({});
            instance.removeEmptyTableRows = jest.fn().mockReturnValue([[{ value: 1 }], [{ value: 2 }]]);
            const props = { tableColumns: [{ header: "A" }], showRowNumbers: true };
            const result = instance.getTableRowsFromProps(props, [1, 2]);
            expect(result[0][0]).toEqual({
                tagName: "custom-field-data",
                hideTitle: true,
                isChildComponent: true,
                resourceValues: { data: 1 }
            });
            expect(result[1][0].resourceValues.data).toBe(2);
        });
    });

    describe("getValidationMessagesFromProps", () => {
        it("should call validateTableHeadersTextResourceBindings with tableColumns", () => {
            validateTableHeadersTextResourceBindings.mockReturnValue(["msg"]);
            const props = { tableColumns: [{ header: "A" }] };
            const instance = new CustomTableData({});
            const result = instance.getValidationMessagesFromProps(props);
            expect(result).toEqual(["msg"]);
            expect(validateTableHeadersTextResourceBindings).toHaveBeenCalledWith(props.tableColumns);
        });
    });

    describe("removeEmptyTableRows", () => {
        it("should remove rows where all cells are empty", () => {
            // Simulate instantiateComponent returning objects with isEmpty property
            instantiateComponent.mockImplementation((cell) => cell);
            const tableRows = [
                [{ isEmpty: true }, { isEmpty: true }],
                [{ isEmpty: false }, { isEmpty: true }],
                [{ isEmpty: false }, { isEmpty: false }]
            ];
            const instance = new CustomTableData({});
            const result = instance.removeEmptyTableRows(tableRows);
            expect(result.length).toBe(2);
            expect(result[0][0].isEmpty).toBe(false);
            expect(result[1][0].isEmpty).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableData({});
            expect(instance.hasContent({})).toBe(true);
            hasValue.mockReturnValue(false);
            expect(instance.hasContent({})).toBe(false);
        });
    });
});
