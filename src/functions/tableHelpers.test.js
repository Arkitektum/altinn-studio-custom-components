import { getTableHeaders, getTableRows, getPartTableElement } from "./tableHelpers.js";
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getTextResourcesFromResourceBindings, getValueFromDataKey, hasValue } from "./helpers.js";

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
        it("should generate table rows with data populated from the provided data and columns", () => {
            const tableColumns = [
                { dataKey: "name", tagName: "custom-field-name", props: { styleOverride: { width: "150px" } } },
                { dataKey: "email", tagName: "custom-field-email", props: { styleOverride: { width: "200px" } } }
            ];
            const texts = {};
            const data = [
                { name: "John Doe", email: "john.doe@example.com" },
                { name: "Jane Smith", email: "jane.smith@example.com" }
            ];

            getValueFromDataKey.mockImplementation((row, key) => row[key]);
            hasValue.mockImplementation((value) => value !== undefined && value !== null);

            const result = getTableRows(tableColumns, texts, data);

            expect(result).toEqual([
                [
                    { tagName: "custom-field-name", formData: { simpleBinding: "John Doe" }, hideTitle: true, styleOverride: { width: "150px" } },
                    {
                        tagName: "custom-field-email",
                        formData: { simpleBinding: "john.doe@example.com" },
                        hideTitle: true,
                        styleOverride: { width: "200px" }
                    }
                ],
                [
                    { tagName: "custom-field-name", formData: { simpleBinding: "Jane Smith" }, hideTitle: true, styleOverride: { width: "150px" } },
                    {
                        tagName: "custom-field-email",
                        formData: { simpleBinding: "jane.smith@example.com" },
                        hideTitle: true,
                        styleOverride: { width: "200px" }
                    }
                ]
            ]);
        });

        it("should handle empty fields using emptyFieldTextResourceKey", () => {
            const tableColumns = [
                { dataKey: "name", tagName: "custom-field-name", props: {}, emptyFieldTextResourceKey: "emptyName" },
                { dataKey: "email", tagName: "custom-field-email", props: {}, emptyFieldTextResourceKey: "emptyEmail" }
            ];
            const texts = {
                emptyName: "No Name",
                emptyEmail: "No Email"
            };
            const data = [{ name: null, email: undefined }];

            getValueFromDataKey.mockImplementation((row, key) => row[key]);
            hasValue.mockImplementation((value) => value !== undefined && value !== null);

            const result = getTableRows(tableColumns, texts, data);

            expect(result).toEqual([
                [
                    { tagName: "custom-field-name", formData: { simpleBinding: "No Name" }, hideTitle: true },
                    { tagName: "custom-field-email", formData: { simpleBinding: "No Email" }, hideTitle: true }
                ]
            ]);
        });

        it("should handle single object data input", () => {
            const tableColumns = [
                { dataKey: "name", tagName: "custom-field-name", props: { styleOverride: { width: "150px" } } },
                { dataKey: "email", tagName: "custom-field-email", props: { styleOverride: { width: "200px" } } }
            ];
            const texts = {};
            const data = { name: "John Doe", email: "john.doe@example.com" };

            getValueFromDataKey.mockImplementation((row, key) => row[key]);
            hasValue.mockImplementation((value) => value !== undefined && value !== null);

            const result = getTableRows(tableColumns, texts, data);

            expect(result).toEqual([
                [
                    { tagName: "custom-field-name", formData: { simpleBinding: "John Doe" }, hideTitle: true, styleOverride: { width: "150px" } },
                    {
                        tagName: "custom-field-email",
                        formData: { simpleBinding: "john.doe@example.com" },
                        hideTitle: true,
                        styleOverride: { width: "200px" }
                    }
                ]
            ]);
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
