import type { ComponentProps, TableColumn } from "../../../types.ts";

import { getComponentDataValue, getRowNumberTitle } from "../../../functions/helpers.ts";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.ts";
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.ts";
import CustomTableData from "./CustomTableData.ts";
import { instantiateComponent } from "../../../functions/componentHelpers.ts";

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
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getRowNumberTitle: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
}));
jest.mock("../../../functions/tableHelpers.ts", () => ({
    getTableHeaders: jest.fn(),
    getTableRows: jest.fn()
}));
jest.mock("../../../functions/componentHelpers.ts", () => ({
    instantiateComponent: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({});
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (validateTableHeadersTextResourceBindings as unknown as jest.Mock).mockReturnValue(["msg"]);
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `resource:${key}`);

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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([1]);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (validateTableHeadersTextResourceBindings as unknown as jest.Mock).mockReturnValue([]);
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `resource:${key}`);

            // getValueFromFormData returns tableData
            const getValueFromFormDataSpy = jest
                .spyOn(CustomTableData.prototype, "getValueFromFormData")
                .mockReturnValue(tableData);

            try {
                const instance = new CustomTableData(props as unknown as ComponentProps);

                expect(instance.isEmpty).toBe(false);
                expect(instance.resourceValues.data).toBe(tableData);
            } finally {
                getValueFromFormDataSpy.mockRestore();
            }
        });
    });

    describe("getTableHeadersFromProps", () => {
        it("should return empty array when tableColumns is empty", () => {
            const instance = new CustomTableData({
                resourceBindings: { title: "titleKey" },
                tableColumns: []
            });
            const result = instance.getTableHeadersFromProps({});
            expect(result).toEqual([]);
        });

        it("should return headers from getTableHeaders", () => {
            (getTableHeaders as unknown as jest.Mock).mockReturnValue([{ text: "A" }]);
            const props = { tableColumns: [{ header: "A" }] };
            const instance = new CustomTableData({});
            const result = instance.getTableHeadersFromProps(props as unknown as ComponentProps);
            expect(result).toEqual([{ text: "A" }]);
        });

        it("should prepend row number header if showRowNumbers is true", () => {
            (getTableHeaders as unknown as jest.Mock).mockReturnValue([{ text: "A" }]);
            (getRowNumberTitle as unknown as jest.Mock).mockReturnValue("Row #");
            const props = { tableColumns: [{ header: "A" }], showRowNumbers: true };
            const instance = new CustomTableData({});
            const result = instance.getTableHeadersFromProps(props as unknown as ComponentProps);
            expect(result[0]).toEqual({ text: "Row #", styleOverride: { textAlign: "right" } });
        });
    });

    describe("getTableRowsFromProps", () => {
        it("should return rows from getTableRows and remove empty rows", () => {
            (getTableRows as unknown as jest.Mock).mockReturnValue([[{ value: 1 }], [{ value: 2 }]]);
            const instance = new CustomTableData({});
            instance.removeEmptyTableRows = jest.fn().mockReturnValue([[{ value: 1 }]]) as never;
            const props = { tableColumns: [{ header: "A" }] };
            const result = instance.getTableRowsFromProps(props as unknown as ComponentProps, [1]);
            expect(result).toEqual([[{ value: 1 }]]);
        });

        it("should add row numbers if showRowNumbers is true", () => {
            (getTableRows as unknown as jest.Mock).mockReturnValue([[{ value: 1 }], [{ value: 2 }]]);
            const instance = new CustomTableData({});
            instance.removeEmptyTableRows = jest.fn().mockReturnValue([[{ value: 1 }], [{ value: 2 }]]) as never;
            const props = { tableColumns: [{ header: "A" }], showRowNumbers: true };
            const result = instance.getTableRowsFromProps(props as unknown as ComponentProps, [1, 2]);
            expect(result[0]![0]).toEqual({
                tagName: "custom-field-data",
                hideTitle: true,
                isChildComponent: true,
                resourceValues: { data: 1 },
                styleOverride: { textAlign: "right" }
            });
            expect(result[1]![0]!.resourceValues.data).toBe(2);
        });
    });

    describe("getValidationMessagesFromProps", () => {
        it("should call validateTableHeadersTextResourceBindings with tableColumns", () => {
            (validateTableHeadersTextResourceBindings as unknown as jest.Mock).mockReturnValue(["msg"]);
            const props = { tableColumns: [{ header: "A" }] };
            const instance = new CustomTableData({});
            const result = instance.getValidationMessagesFromProps(props as unknown as ComponentProps);
            expect(result).toEqual(["msg"]);
            expect(validateTableHeadersTextResourceBindings).toHaveBeenCalledWith(props.tableColumns as unknown as TableColumn[]);
        });
    });

    describe("removeEmptyTableRows", () => {
        it("should remove rows where all cells are empty", () => {
            // Table rows contain cells with an isEmpty property used by removeEmptyTableRows
            (instantiateComponent as unknown as jest.Mock).mockImplementation((cell) => cell);
            const tableRows = [
                [{ isEmpty: true }, { isEmpty: true }],
                [{ isEmpty: false }, { isEmpty: true }],
                [{ isEmpty: false }, { isEmpty: false }]
            ];
            const instance = new CustomTableData({});
            const result = instance.removeEmptyTableRows(tableRows) as unknown as { isEmpty?: boolean }[][];
            expect(result.length).toBe(2);
            expect(result[0]![0]!.isEmpty).toBe(false);
            expect(result[1]![0]!.isEmpty).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomTableData({});
            expect(instance.hasContent({})).toBe(true);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            expect(instance.hasContent({})).toBe(false);
        });
    });
});
