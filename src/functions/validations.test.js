import { hasValidationMessages, hasMissingTextResources, validateTableHeadersTextResourceBindings } from "./validations.js";

// Mock ValidationMessages class
class ValidationMessages {
    constructor() {
        this.error = [];
        this.info = [];
    }
}

describe("hasValidationMessages", () => {
    it("returns false for undefined or null", () => {
        expect(hasValidationMessages(undefined)).toBe(false);
        expect(hasValidationMessages(null)).toBe(false);
    });

    it("returns false for empty error/info arrays", () => {
        const messages = { error: [], info: [] };
        expect(hasValidationMessages(messages)).toBe(false);
    });

    it("returns true if error array has messages", () => {
        const messages = { error: ["err"], info: [] };
        expect(hasValidationMessages(messages)).toBe(true);
    });

    it("returns true if info array has messages", () => {
        const messages = { error: [], info: ["info"] };
        expect(hasValidationMessages(messages)).toBe(true);
    });

    it("returns true if any property array has length > 0", () => {
        const messages = { foo: [], bar: ["baz"] };
        expect(hasValidationMessages(messages)).toBe(true);
    });
});

describe("hasMissingTextResources", () => {
    it("returns no errors or info if all resources exist and are non-empty", () => {
        const textResources = {
            resources: [
                { id: "id1", value: "Hello" },
                { id: "id2", value: "World" }
            ]
        };
        const textResourceBindings = {
            comp1: { label: "id1", desc: "id2" }
        };
        const result = hasMissingTextResources(textResources, textResourceBindings, new ValidationMessages());
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("adds error if resource is missing", () => {
        const textResources = { resources: [{ id: "id1", value: "Hello" }] };
        const textResourceBindings = {
            comp1: { label: "id1", desc: "id2" }
        };
        const result = hasMissingTextResources(textResources, textResourceBindings, new ValidationMessages());
        expect(result.error).toContain('Missing text resource for "desc" with id: "id2" in component "comp1"');
        expect(result.info).toHaveLength(0);
    });

    it("adds info if resource value is empty", () => {
        const textResources = {
            resources: [
                { id: "id1", value: "" },
                { id: "id2", value: "World" }
            ]
        };
        const textResourceBindings = {
            comp1: { label: "id1", desc: "id2" }
        };
        const result = hasMissingTextResources(textResources, textResourceBindings, new ValidationMessages());
        expect(result.info).toContain('Empty text resource for "label" with id: "id1" in component "comp1"');
        expect(result.error).toHaveLength(0);
    });

    it("works with default ValidationMessages instance", () => {
        const textResources = { resources: [] };
        const textResourceBindings = { comp1: { label: "id1" } };
        const result = hasMissingTextResources(textResources, textResourceBindings);
        expect(result.error.length).toBe(1);
    });

    it("handles empty textResourceBindings", () => {
        const textResources = { resources: [{ id: "id1", value: "foo" }] };
        const textResourceBindings = {};
        const result = hasMissingTextResources(textResources, textResourceBindings, new ValidationMessages());
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });
});

describe("validateTableHeadersTextResourceBindings", () => {
    it("returns no errors or info if all column bindings exist and are non-empty", () => {
        const tableColumns = [{ textResourceBindings: { title: "id1" } }, { textResourceBindings: { title: "id2" } }];
        const textResources = {
            resources: [
                { id: "id1", value: "Col1" },
                { id: "id2", value: "Col2" }
            ]
        };
        const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, new ValidationMessages());
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("adds error if column binding is missing", () => {
        const tableColumns = [{ textResourceBindings: { title: "id1" } }, { textResourceBindings: { title: "id2" } }];
        const textResources = {
            resources: [{ id: "id1", value: "Col1" }]
        };
        const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, new ValidationMessages());
        expect(result.error).toContain('Missing text resource binding with id: "id2" for "title" at table column [1]');
    });

    it("adds info if column binding value is empty", () => {
        const tableColumns = [{ textResourceBindings: { title: "id1" } }];
        const textResources = {
            resources: [{ id: "id1", value: "" }]
        };
        const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, new ValidationMessages());
        expect(result.info).toContain('Empty text resource binding with id: "id1" for "title" at table column [0]');
    });

    it("handles columns with no textResourceBindings", () => {
        const tableColumns = [{}, { textResourceBindings: { title: "id1" } }];
        const textResources = {
            resources: [{ id: "id1", value: "Col1" }]
        };
        const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, new ValidationMessages());
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("works with default ValidationMessages instance", () => {
        const tableColumns = [{ textResourceBindings: { title: "id1" } }];
        const textResources = { resources: [] };
        const result = validateTableHeadersTextResourceBindings(tableColumns, textResources);
        expect(result.error.length).toBe(1);
    });
});
