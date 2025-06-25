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
        it("should generate table rows with the correct component properties for multiple data rows", () => {
            const tableColumns = [
                {
                    dataKey: "name",
                    emptyFieldTextResourceKey: "emptyName",
                    props: { styleOverride: { width: "150px" } },
                    tagName: "custom-field-name"
                },
                {
                    dataKey: "email",
                    emptyFieldTextResourceKey: "emptyEmail",
                    props: { styleOverride: { width: "200px" } },
                    tagName: "custom-field-email"
                }
            ];
            const texts = {
                emptyName: "No Name",
                emptyEmail: "No Email"
            };
            const data = [
                { name: "John Doe", email: "john.doe@example.com" },
                { name: "Jane Smith", email: "" }
            ];

            getValueFromDataKey.mockImplementation((row, key) => row[key]);
            hasValue.mockImplementation((value) => value !== undefined && value !== null && value !== "");

            const result = getTableRows(tableColumns, texts, data);

            expect(result).toEqual([
                [
                    {
                        formData: { simpleBinding: "John Doe" },
                        hideTitle: true,
                        tagName: "custom-field-name",
                        styleOverride: { width: "150px" },
                        texts: { emptyFieldText: "No Name" }
                    },
                    {
                        formData: { simpleBinding: "john.doe@example.com" },
                        hideTitle: true,
                        tagName: "custom-field-email",
                        styleOverride: { width: "200px" },
                        texts: { emptyFieldText: "No Email" }
                    }
                ],
                [
                    {
                        formData: { simpleBinding: "Jane Smith" },
                        hideTitle: true,
                        tagName: "custom-field-name",
                        styleOverride: { width: "150px" },
                        texts: { emptyFieldText: "No Name" }
                    },
                    {
                        formData: { simpleBinding: "" },
                        hideTitle: true,
                        tagName: "custom-field-email",
                        styleOverride: { width: "200px" },
                        texts: { emptyFieldText: "No Email" }
                    }
                ]
            ]);
        });

        it("should handle a single data object and generate the correct table row", () => {
            const tableColumns = [
                {
                    dataKey: "name",
                    emptyFieldTextResourceKey: "emptyName",
                    props: { styleOverride: { width: "150px" } },
                    tagName: "custom-field-name"
                }
            ];
            const texts = {
                emptyName: "No Name"
            };
            const data = { name: "" };

            getValueFromDataKey.mockImplementation((row, key) => row[key]);
            hasValue.mockImplementation((value) => value !== undefined && value !== null && value !== "");

            const result = getTableRows(tableColumns, texts, data);

            expect(result).toEqual([
                [
                    {
                        formData: { simpleBinding: "" },
                        hideTitle: true,
                        tagName: "custom-field-name",
                        styleOverride: { width: "150px" },
                        texts: { emptyFieldText: "No Name" }
                    }
                ]
            ]);
        });

        it("should handle empty data and return an empty array", () => {
            const tableColumns = [
                {
                    dataKey: "name",
                    emptyFieldTextResourceKey: "emptyName",
                    props: { styleOverride: { width: "150px" } },
                    tagName: "custom-field-name"
                }
            ];
            const texts = {
                emptyName: "No Name"
            };
            const data = [];

            const result = getTableRows(tableColumns, texts, data);

            expect(result).toEqual([]);
        });
    });
});
