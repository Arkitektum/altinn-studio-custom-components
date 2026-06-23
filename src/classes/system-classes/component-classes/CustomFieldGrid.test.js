import CustomFieldGrid from "./CustomFieldGrid";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {
        constructor() {}
    };
});
jest.mock("../../../functions/componentHelpers.js", () => ({
    instantiateComponent: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResourceFromResourceBinding: jest.fn((binding) => binding),
    getValueFromDataKey: jest.fn((data, key) => data?.[key]),
    hasValue: jest.fn((value) => value !== undefined && value !== null && value !== "")
}));

describe("CustomFieldGrid", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        instantiateComponent.mockImplementation((cell) => ({
            isEmpty: cell?.resourceValues?.data === undefined || cell?.resourceValues?.data === null || cell?.resourceValues?.data === ""
        }));
    });

    const tableColumns = [
        { dataKey: "plannavn", resourceBindings: { title: "resource.plannavn.title" } },
        { value: "pbl. § 12-10", resourceBindings: { title: "resource.hjemmel.title" } }
    ];

    it("builds one row per column, with hidden title and value read from formData by dataKey", () => {
        const instance = new CustomFieldGrid({ tableColumns, formData: { plannavn: "Solsiden" } });
        const rows = instance.resourceValues.data;
        expect(rows).toHaveLength(2);
        expect(rows[0].term).toBe("resource.plannavn.title");
        expect(rows[0].valueComponent).toMatchObject({
            tagName: "custom-field-data",
            isChildComponent: true,
            hideTitle: true,
            resourceValues: { data: "Solsiden" }
        });
    });

    it("uses a static column value when provided instead of a data binding", () => {
        const instance = new CustomFieldGrid({ tableColumns, formData: {} });
        const staticRow = instance.resourceValues.data[1];
        expect(staticRow.valueComponent.resourceValues.data).toBe("pbl. § 12-10");
        expect(staticRow.isEmpty).toBe(false);
    });

    it("marks rows empty when neither a value nor bound data is present", () => {
        const instance = new CustomFieldGrid({
            tableColumns: [{ dataKey: "x", resourceBindings: { title: "t" } }],
            formData: {}
        });
        expect(instance.resourceValues.data[0].isEmpty).toBe(true);
        expect(instance.isEmpty).toBe(true);
    });

    it("is not empty when at least one row has content", () => {
        const instance = new CustomFieldGrid({ tableColumns, formData: {} });
        // The static "pbl. § 12-10" row keeps the grid non-empty.
        expect(instance.isEmpty).toBe(false);
    });

    it("handles missing tableColumns gracefully", () => {
        const instance = new CustomFieldGrid({ formData: { plannavn: "x" } });
        expect(instance.resourceValues.data).toEqual([]);
        expect(instance.isEmpty).toBe(true);
    });
});
