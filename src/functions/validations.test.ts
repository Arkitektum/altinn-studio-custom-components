import { hasMissingTextResources, hasValidationMessages, validateTableHeadersTextResourceBindings } from "./validations.ts";

// Mock ValidationMessages class
export class ValidationMessages {
    error: string[] = [];
    warning: string[] = [];
    info: string[] = [];
    success: string[] = [];
    default: string[] = [];
}

jest.mock("../classes/system-classes/ValidationMessages.ts", () => {
    class ValidationMessages {
        error: string[] = [];
        warning: string[] = [];
        info: string[] = [];
        success: string[] = [];
        default: string[] = [];
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

jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    getTextResources: jest.fn(() => mockTextResources),
    getDefaultTextResources: jest.fn(() => mockTextResources)
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
    it("returns no errors or info if all resources exist and are not empty", () => {
        const bindings = {
            comp1: { header: "header" }
        };
        const result = hasMissingTextResources(bindings);
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("returns error for missing resource", () => {
        const bindings = {
            comp1: { missing: "notfound" }
        };
        const result = hasMissingTextResources(bindings);
        expect(result.error[0]).toMatch(/Missing text resource/);
        expect(result.info).toHaveLength(0);
    });

    it("returns info for empty resource value", () => {
        const bindings = {
            comp1: { desc: "desc" }
        };
        const result = hasMissingTextResources(bindings);
        expect(result.error).toHaveLength(0);
        expect(result.info[0]).toMatch(/Empty text resource/);
    });

    it("accumulates errors and info for multiple bindings", () => {
        const bindings = {
            comp1: { header: "header", desc: "desc", missing: "notfound" }
        };
        const result = hasMissingTextResources(bindings);
        expect(result.error).toHaveLength(1);
        expect(result.info).toHaveLength(1);
    });

    it("uses provided ValidationMessages instance", () => {
        const bindings = {
            comp1: { missing: "notfound" }
        };
        const customMessages = new ValidationMessages();
        customMessages.error.push("Existing error");
        const result = hasMissingTextResources(bindings, customMessages);
        expect(result.error).toContain("Existing error");
        expect(result.error.length).toBe(2);
    });
});

describe("validateTableHeadersTextResourceBindings", () => {
    it("returns no errors or info if all bindings exist and are not empty", () => {
        const columns = [{ resourceBindings: { header: "header" } }, { resourceBindings: { exists: "exists" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(0);
        expect(result.info).toHaveLength(0);
    });

    it("returns error for missing binding", () => {
        const columns = [{ resourceBindings: { missing: "notfound" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error[0]).toMatch(/Missing text resource binding/);
        expect(result.info).toHaveLength(0);
    });

    it("returns info for empty binding value", () => {
        const columns = [{ resourceBindings: { desc: "desc" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(0);
        expect(result.info[0]).toMatch(/Empty text resource binding/);
    });

    it("handles multiple columns and bindings", () => {
        const columns = [{ resourceBindings: { header: "header", missing: "notfound" } }, { resourceBindings: { desc: "desc" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(1);
        expect(result.info).toHaveLength(1);
    });

    it("checks nothing, rather than throwing, when the columns are missing", () => {
        // A missing tableColumns attribute reaches here as false, not undefined.
        expect(validateTableHeadersTextResourceBindings(false as unknown as undefined).error).toHaveLength(0);
        expect(validateTableHeadersTextResourceBindings(undefined).error).toHaveLength(0);
    });

    it("skips a binding a column leaves out", () => {
        const columns = [{ resourceBindings: { title: "header", emptyFieldText: undefined } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toHaveLength(0);
    });

    it("names the id, the binding and the column in a missing binding's message", () => {
        const columns = [{ resourceBindings: { title: "header" } }, { resourceBindings: { title: "notfound" } }];
        const result = validateTableHeadersTextResourceBindings(columns);
        expect(result.error).toEqual(['Missing text resource binding with id: "notfound" for "title" at table column [1]']);
    });

    it("uses provided ValidationMessages instance", () => {
        const columns = [{ resourceBindings: { missing: "notfound" } }];
        const customMessages = new ValidationMessages();
        customMessages.error.push("Existing error");
        const result = validateTableHeadersTextResourceBindings(columns, customMessages);
        expect(result.error).toContain("Existing error");
        expect(result.error.length).toBe(2);
    });
});
