import { hasValidationMessages, hasMissingTextResources, validateTableHeadersTextResourceBindings } from "./validations.js";

// Mock ValidationMessages class
export class ValidationMessages {
    constructor() {
        this.error = [];
        this.info = [];
    }
}

jest.mock("../classes/system-classes/ValidationMessages.js", () => {
    class ValidationMessages {
        constructor() {
            this.error = [];
            this.info = [];
        }
    }
    return {
        __esModule: true,
        default: ValidationMessages
    };
});

// Mock getTextResources
const mockTextResources = {
    resources: [
        { id: "header", value: "Header text" },
        { id: "desc", value: "" },
        { id: "exists", value: "Exists" }
    ]
};

jest.mock("./helpers.js", () => ({
    getTextResources: jest.fn(() => mockTextResources)
}));

describe("hasValidationMessages", () => {
    it("returns false for undefined or null", () => {
        expect(hasValidationMessages(undefined)).toBe(false);
        expect(hasValidationMessages(null)).toBe(false);
    });

    it("returns false for empty object", () => {
        expect(hasValidationMessages({})).toBe(false);
    });

    it("returns false if all arrays are empty", () => {
        expect(hasValidationMessages({ error: [], info: [] })).toBe(false);
    });

    it("returns true if any array has length > 0", () => {
        expect(hasValidationMessages({ error: ["msg"], info: [] })).toBe(true);
        expect(hasValidationMessages({ error: [], info: ["msg"] })).toBe(true);
        expect(hasValidationMessages({ error: ["msg1"], info: ["msg2"] })).toBe(true);
    });
});

describe("hasMissingTextResources", () => {
    const textResources = {
        resources: [
            { id: "header", value: "Header text" },
            { id: "desc", value: "" }
        ]
    };

    it("returns no errors or info if all resources exist and are not empty", () => {
        const bindings = {
            comp1: { header: "header" }
        };
        const result = hasMissingTextResources(textResources, bindings);
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("returns error for missing resource", () => {
        const bindings = {
            comp1: { missing: "notfound" }
        };
        const result = hasMissingTextResources(textResources, bindings);
        expect(result.error[0]).toMatch(/Missing text resource/);
        expect(result.info).toHaveLength(0);
    });

    it("returns info for empty resource value", () => {
        const bindings = {
            comp1: { desc: "desc" }
        };
        const result = hasMissingTextResources(textResources, bindings);
        expect(result.error).toHaveLength(0);
        expect(result.info[0]).toMatch(/Empty text resource/);
    });

    it("accumulates errors and info for multiple bindings", () => {
        const bindings = {
            comp1: { header: "header", desc: "desc", missing: "notfound" }
        };
        const result = hasMissingTextResources(textResources, bindings);
        expect(result.error).toHaveLength(1);
        expect(result.info).toHaveLength(1);
    });

    it("uses provided ValidationMessages instance", () => {
        const bindings = {
            comp1: { missing: "notfound" }
        };
        const customMessages = new ValidationMessages();
        customMessages.error.push("Existing error");
        const result = hasMissingTextResources(textResources, bindings, customMessages);
        expect(result.error).toContain("Existing error");
        expect(result.error.length).toBe(2);
    });
});

describe("validateTableHeadersTextResourceBindings", () => {
    it("returns no errors or info if all bindings exist and are not empty", () => {
        const columns = [{ textResourceBindings: { header: "header" } }, { textResourceBindings: { exists: "exists" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("returns error for missing binding", () => {
        const columns = [{ textResourceBindings: { missing: "notfound" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error[0]).toMatch(/Missing text resource binding/);
        expect(result.info).toHaveLength(0);
    });

    it("returns info for empty binding value", () => {
        const columns = [{ textResourceBindings: { desc: "desc" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(0);
        expect(result.info[0]).toMatch(/Empty text resource binding/);
    });

    it("handles multiple columns and bindings", () => {
        const columns = [{ textResourceBindings: { header: "header", missing: "notfound" } }, { textResourceBindings: { desc: "desc" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(1);
        expect(result.info).toHaveLength(1);
    });

    it("uses provided ValidationMessages instance", () => {
        const columns = [{ textResourceBindings: { missing: "notfound" } }];
        const customMessages = new ValidationMessages();
        customMessages.error.push("Existing error");
        const result = validateTableHeadersTextResourceBindings(columns, customMessages);
        expect(result.error).toContain("Existing error");
        expect(result.error.length).toBe(2);
    });
});
