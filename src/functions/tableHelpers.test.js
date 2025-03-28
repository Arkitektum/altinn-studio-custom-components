import { getTableHeaders, getTableRows, getPartTableElement } from "./tableHelpers.js";
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getTextResourcesFromResourceBindings, getValueFromDataKey } from "./helpers.js";

jest.mock("../classes/system-classes/CustomElementHtmlAttributes.js");
jest.mock("./helpers.js");

describe("tableHelpers", () => {
    describe("getTableHeaders", () => {
        it("should generate table headers with localized text and props", () => {
            const tableColumns = [
                { titleResourceKey: "header1", props: { styleOverride: { width: "100px" } } },
                { titleResourceKey: "header2", props: { styleOverride: { width: "200px" } } }
            ];
            const texts = {
                header1: "Header 1",
                header2: "Header 2"
            };

            const result = getTableHeaders(tableColumns, texts);

            expect(result).toEqual([
                { text: "Header 1", props: { styleOverride: { width: "100px" } } },
                { text: "Header 2", props: { styleOverride: { width: "200px" } } }
            ]);
        });
    });

    describe("getTableRows", () => {
        it("should generate table rows from data and columns", () => {
            const tableColumns = [
                { dataKey: "name", props: { styleOverride: "20%" }, tagName: "custom-name" },
                { dataKey: "age", props: { styleOverride: "40px" }, tagName: "custom-age" }
            ];
            const data = [
                { name: "John", age: 30 },
                { name: "Jane", age: 25 }
            ];

            getValueFromDataKey.mockImplementation((row, key) => row[key]);

            const result = getTableRows(tableColumns, data);

            expect(result).toEqual([
                [
                    { styleOverride: "20%", formData: { simpleBinding: "John" }, hideTitle: true, tagName: "custom-name" },
                    { styleOverride: "40px", formData: { simpleBinding: 30 }, hideTitle: true, tagName: "custom-age" }
                ],
                [
                    { styleOverride: "20%", formData: { simpleBinding: "Jane" }, hideTitle: true, tagName: "custom-name" },
                    { styleOverride: "40px", formData: { simpleBinding: 25 }, hideTitle: true, tagName: "custom-age" }
                ]
            ]);
        });

        it("should handle single object data input", () => {
            const tableColumns = [{ dataKey: "name", props: { className: "name-column" }, tagName: "custom-name" }];
            const data = { name: "John" };

            getValueFromDataKey.mockImplementation((row, key) => row[key]);

            const result = getTableRows(tableColumns, data);

            expect(result).toEqual([[{ className: "name-column", formData: { simpleBinding: "John" }, hideTitle: true, tagName: "custom-name" }]]);
        });
    });

    describe("getPartTableElement", () => {
        it("should generate a custom table element with the correct attributes", () => {
            const part = { id: 1, name: "Part 1" };
            const textResources = [{ id: "col-1", value: "Column 1" }];
            const textResourceBindingsForPart = { "col-1": "Column 1" };

            getTextResourcesFromResourceBindings.mockReturnValue({
                "col-1": "Column 1"
            });

            const mockTableElement = {};
            createCustomElement.mockReturnValue(mockTableElement);

            const result = getPartTableElement(part, textResources, textResourceBindingsForPart);

            expect(CustomElementHtmlAttributes).toHaveBeenCalledWith({
                formData: { data: part },
                texts: { "col-1": "Column 1" },
                size: "h3",
                hideIfEmpty: true,
                tableColumns: expect.any(Array)
            });
            expect(createCustomElement).toHaveBeenCalledWith("custom-table-data", expect.any(CustomElementHtmlAttributes));
            expect(result).toBe(mockTableElement);
        });
    });
});
