import { hasValidationMessages, hasMissingTextResources, validateTableHeadersTextResourceBindings } from "./validations.js";
import ValidationMessages from "../classes/system-classes/ValidationMessages.js";

describe("validations.js", () => {
    describe("hasValidationMessages", () => {
        it("should return true if there are validation messages with a length greater than 0", () => {
            const validationMessages = {
                error: ["Error message"],
                info: []
            };
            expect(hasValidationMessages(validationMessages)).toBe(true);
        });

        it("should return false if there are no validation messages", () => {
            const validationMessages = {
                error: [],
                info: []
            };
            expect(hasValidationMessages(validationMessages)).toBe(false);
        });

        it("should return false if validationMessages is null or undefined", () => {
            expect(hasValidationMessages(null)).toBe(false);
            expect(hasValidationMessages(undefined)).toBe(false);
        });
    });

    describe("hasMissingTextResources", () => {
        it("should add errors for missing text resources", () => {
            const textResources = { resources: [{ id: "existingKey", value: "Some text" }] };
            const textResourceBindings = { component1: { key1: "missingKey" } };
            const validationMessages = new ValidationMessages();

            const result = hasMissingTextResources(textResources, textResourceBindings, validationMessages);

            expect(result.error).toContain('Missing text resource with id: "missingKey"');
        });

        it("should add info for empty text resources", () => {
            const textResources = { resources: [{ id: "emptyKey", value: "" }] };
            const textResourceBindings = { component1: { key1: "emptyKey" } };
            const validationMessages = new ValidationMessages();

            const result = hasMissingTextResources(textResources, textResourceBindings, validationMessages);

            expect(result.info).toContain('Empty text resource with id: "emptyKey"');
        });

        it("should not add errors or info for valid text resources", () => {
            const textResources = { resources: [{ id: "validKey", value: "Valid text" }] };
            const textResourceBindings = { component1: { key1: "validKey" } };
            const validationMessages = new ValidationMessages();

            const result = hasMissingTextResources(textResources, textResourceBindings, validationMessages);

            expect(result.error).toHaveLength(0);
            expect(result.info).toHaveLength(0);
        });
    });

    describe("validateTableHeadersTextResourceBindings", () => {
        it("should add errors for missing text resource bindings", () => {
            const tableColumns = [{ titleResourceKey: "missingKey" }];
            const textResources = {};
            const validationMessages = new ValidationMessages();

            const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, validationMessages);

            expect(result.error).toContain('Missing text resource binding with id: "missingKey"');
        });

        it("should add info for empty text resource bindings", () => {
            const tableColumns = [{ titleResourceKey: "emptyKey" }];
            const textResources = { emptyKey: "" };
            const validationMessages = new ValidationMessages();

            const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, validationMessages);

            expect(result.info).toContain('Empty text resource binding with id: "emptyKey"');
        });

        it("should not add errors or info for valid text resource bindings", () => {
            const tableColumns = [{ titleResourceKey: "validKey" }];
            const textResources = { validKey: "Valid text" };
            const validationMessages = new ValidationMessages();

            const result = validateTableHeadersTextResourceBindings(tableColumns, textResources, validationMessages);

            expect(result.error).toHaveLength(0);
            expect(result.info).toHaveLength(0);
        });
    });
});
