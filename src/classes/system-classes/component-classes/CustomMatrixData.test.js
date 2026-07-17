import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";
import CustomMatrixData from "./CustomMatrixData";
import { getComponentDataValue } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    const { hasValue } = require("@arkitektum/altinn-studio-custom-components-utils");
    const { hasMissingTextResources } = require("../../../functions/validations.js");
    return class {
        hasContent(data) {
            return hasValue(data);
        }
        getValidationMessages(resourceBindings) {
            return hasMissingTextResources(resourceBindings);
        }
    };
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("../../../functions/tableHelpers.js", () => ({
    getTableHeaders: jest.fn(),
    getTableRows: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasValidationMessages: jest.fn(),
    validateTableHeadersTextResourceBindings: jest.fn()
}));
jest.mock("../../../functions/componentHelpers.js", () => ({
    instantiateComponent: jest.fn()
}));

describe("CustomMatrixData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("sets empty-state resource text when matrix has no content", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                },
                tableColumns: []
            };

            getComponentDataValue.mockReturnValue(null);
            hasValue.mockImplementation((value) => value !== null && value !== undefined && value !== "");
            validateTableHeadersTextResourceBindings.mockReturnValue(["header warning"]);
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);

            const instance = new CustomMatrixData(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toEqual(["header warning"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceValues).toEqual({
                title: "resource:titleKey",
                data: "resource:emptyKey"
            });
        });

        it("sets matrix data when content exists", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                },
                tableColumns: [{ header: "A" }]
            };

            const matrixData = { matrixHeaders: [{ text: "A" }], matrixRows: [[{ value: 1 }]] };
            validateTableHeadersTextResourceBindings.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            hasValue.mockImplementation((value) => value !== null && value !== undefined && value !== "");
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);

            const getValueFromFormDataSpy = jest.spyOn(CustomMatrixData.prototype, "getValueFromFormData").mockReturnValue(matrixData);

            try {
                const instance = new CustomMatrixData(props);
                expect(instance.isEmpty).toBe(false);
                expect(instance.resourceValues.data).toBe(matrixData);
                expect(instance.resourceValues.title).toBe("resource:titleKey");
            } finally {
                getValueFromFormDataSpy.mockRestore();
            }
        });

        it("uses provided title resource value over resource binding", () => {
            const props = {
                resourceValues: { title: "Direct title" },
                resourceBindings: { title: "titleKey", emptyFieldText: "emptyKey" },
                tableColumns: []
            };

            getComponentDataValue.mockReturnValue(null);
            hasValue.mockImplementation((value) => value !== null && value !== undefined && value !== "");
            validateTableHeadersTextResourceBindings.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);

            const instance = new CustomMatrixData(props);
            expect(instance.resourceValues.title).toBe("Direct title");
        });
    });

    describe("getValueFromFormData", () => {
        it("returns null when component data is missing", () => {
            getComponentDataValue.mockReturnValue(null);
            const instance = new CustomMatrixData({ tableColumns: [] });

            const result = instance.getValueFromFormData({ tableColumns: [] });
            expect(result).toBeNull();
        });

        it("sorts rows by configured order key before building matrix rows", () => {
            const data = [{ age: "12" }, { age: "2" }, { age: "10" }];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockImplementation((value) => value !== null && value !== undefined && value !== "");
            validateTableHeadersTextResourceBindings.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("title");
            getTableHeaders.mockReturnValue([{ text: "Age" }]);
            getTableRows.mockImplementation((tableColumns, inputData) => inputData.map((d) => [{ value: d.age }]));
            instantiateComponent.mockImplementation((cell) => ({ isEmpty: !cell?.value }));

            const props = {
                tableColumns: [{ header: "Age", dataKey: "age" }],
                order: { key: "age", direction: "asc" },
                resourceBindings: { title: "title", emptyFieldText: "empty" }
            };

            const instance = new CustomMatrixData(props);
            const result = instance.getValueFromFormData(props);

            expect(result.matrixHeaders).toEqual([{ text: "Age" }]);
            expect(getTableRows).toHaveBeenLastCalledWith(props.tableColumns, [{ age: "2" }, { age: "10" }, { age: "12" }]);
        });
    });

    describe("sortRowsByKey", () => {
        it("sorts string values in descending order", () => {
            const instance = new CustomMatrixData({ tableColumns: [] });
            const rows = [{ name: "A" }, { name: "C" }, { name: "B" }];

            const result = instance.sortRowsByKey("name", "desc", rows);

            expect(result).toEqual([{ name: "C" }, { name: "B" }, { name: "A" }]);
        });
    });

    describe("getMatrixHeadersFromProps", () => {
        it("returns empty array when tableColumns is empty", () => {
            const instance = new CustomMatrixData({ tableColumns: [] });
            expect(instance.getMatrixHeadersFromProps({})).toEqual([]);
        });

        it("returns matrix headers from getTableHeaders", () => {
            getTableHeaders.mockReturnValue([{ text: "Header" }]);
            const props = { tableColumns: [{ header: "Header" }] };
            const instance = new CustomMatrixData({ tableColumns: [] });

            expect(instance.getMatrixHeadersFromProps(props)).toEqual([{ text: "Header" }]);
            expect(getTableHeaders).toHaveBeenCalledWith(props.tableColumns);
        });
    });

    describe("getMatrixRowsFromProps", () => {
        it("returns non-empty matrix rows", () => {
            const rows = [[{ value: 1 }], [{ value: null }]];
            getTableRows.mockReturnValue(rows);

            const instance = new CustomMatrixData({ tableColumns: [] });
            instance.removeEmptyMatrixRows = jest.fn().mockReturnValue([[{ value: 1 }]]);

            const props = { tableColumns: [{ header: "A" }] };
            const result = instance.getMatrixRowsFromProps(props, [{ a: 1 }]);

            expect(result).toEqual([[{ value: 1 }]]);
            expect(getTableRows).toHaveBeenCalledWith(props.tableColumns, [{ a: 1 }]);
        });
    });

    describe("getValidationMessagesFromProps", () => {
        it("forwards tableColumns to validation helper", () => {
            validateTableHeadersTextResourceBindings.mockReturnValue(["msg"]);
            const props = { tableColumns: [{ header: "A" }] };
            const instance = new CustomMatrixData({ tableColumns: [] });

            expect(instance.getValidationMessagesFromProps(props)).toEqual(["msg"]);
            expect(validateTableHeadersTextResourceBindings).toHaveBeenCalledWith(props.tableColumns);
        });
    });

    describe("removeEmptyMatrixRows", () => {
        it("removes rows where all cells are empty", () => {
            instantiateComponent.mockImplementation((cell) => ({ isEmpty: cell.isEmpty }));
            const matrixRows = [
                [{ isEmpty: true }, { isEmpty: true }],
                [{ isEmpty: false }, { isEmpty: true }],
                [{ isEmpty: false }, { isEmpty: false }]
            ];
            const instance = new CustomMatrixData({ tableColumns: [] });

            const result = instance.removeEmptyMatrixRows(matrixRows);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual([{ isEmpty: false }, { isEmpty: true }]);
            expect(result[1]).toEqual([{ isEmpty: false }, { isEmpty: false }]);
        });

        it("returns empty array for non-array input", () => {
            const instance = new CustomMatrixData({ tableColumns: [] });
            expect(instance.removeEmptyMatrixRows(null)).toEqual([]);
        });
    });

    describe("hasContent", () => {
        it("delegates to hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomMatrixData({ tableColumns: [] });
            expect(instance.hasContent({})).toBe(true);

            hasValue.mockReturnValue(false);
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getComponentUsage", () => {
        it("returns expected component tags", () => {
            const instance = new CustomMatrixData({ tableColumns: [] });
            expect(instance.getComponentUsage()).toEqual(["custom-feedbacklist-validation-messages", "custom-matrix"]);
        });
    });
});
