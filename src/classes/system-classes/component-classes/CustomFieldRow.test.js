import CustomFieldRow from "./CustomFieldRow";
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
jest.mock("../../../functions/componentHelpers.js", () => ({
    instantiateComponent: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResourceFromResourceBinding: jest.fn((binding) => binding),
    getValueFromDataKey: jest.fn((data, key) => data?.[key]),
    hasValue: jest.fn((value) => value !== undefined && value !== null && value !== "")
}));

describe("CustomFieldRow", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // A cell is empty when its resolved data value is empty.
        instantiateComponent.mockImplementation((cell) => ({
            isEmpty: cell?.resourceValues?.data === undefined || cell?.resourceValues?.data === null || cell?.resourceValues?.data === ""
        }));
    });

    const tableColumns = [
        { dataKey: "deres", tagName: "custom-field-data", resourceBindings: { title: "resource.deres.title" } },
        { dataKey: "saksbehandler", tagName: "custom-field-data", format: "date", resourceBindings: { title: "resource.saksbehandler.title" } }
    ];

    it("builds one cell component per column, reading values from formData by dataKey", () => {
        const instance = new CustomFieldRow({
            tableColumns,
            formData: { deres: "2024/5", saksbehandler: "Kari Nordmann" }
        });
        const cells = instance.resourceValues.data;
        expect(cells).toHaveLength(2);
        expect(cells[0]).toMatchObject({
            tagName: "custom-field-data",
            isChildComponent: true,
            resourceBindings: { title: "resource.deres.title" },
            resourceValues: { data: "2024/5" }
        });
        expect(cells[1]).toMatchObject({ format: "date", resourceValues: { data: "Kari Nordmann" } });
    });

    it("defaults a cell tagName to custom-field-data when not provided", () => {
        const instance = new CustomFieldRow({
            tableColumns: [{ dataKey: "deres" }],
            formData: { deres: "x" }
        });
        expect(instance.resourceValues.data[0].tagName).toBe("custom-field-data");
    });

    it("is empty when every cell is empty", () => {
        const instance = new CustomFieldRow({ tableColumns, formData: {} });
        expect(instance.isEmpty).toBe(true);
    });

    it("is not empty when at least one cell has a value", () => {
        const instance = new CustomFieldRow({ tableColumns, formData: { saksbehandler: "Kari Nordmann" } });
        expect(instance.isEmpty).toBe(false);
    });

    it("handles missing tableColumns gracefully", () => {
        const instance = new CustomFieldRow({ formData: { deres: "x" } });
        expect(instance.resourceValues.data).toEqual([]);
        expect(instance.isEmpty).toBe(true);
    });

    it("resolves the optional row caption title from resourceBindings", () => {
        const instance = new CustomFieldRow({ tableColumns, formData: {}, resourceBindings: { title: "resource.row.title" } });
        expect(instance.resourceValues.title).toBe("resource.row.title");
    });
});
