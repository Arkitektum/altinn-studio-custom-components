import ValidationMessages from "./ValidationMessages";

describe("ValidationMessages", () => {
    it("should initialize with default empty arrays when no props are provided", () => {
        const validationMessages = new ValidationMessages({});
        expect(validationMessages.error).toEqual([]);
        expect(validationMessages.warning).toEqual([]);
        expect(validationMessages.info).toEqual([]);
        expect(validationMessages.success).toEqual([]);
        expect(validationMessages.default).toEqual([]);
    });

    it("should initialize with provided error messages", () => {
        const props = { error: ["Error 1", "Error 2"] };
        const validationMessages = new ValidationMessages(props);
        expect(validationMessages.error).toEqual(["Error 1", "Error 2"]);
    });

    it("should initialize with provided warning messages", () => {
        const props = { warning: ["Warning 1"] };
        const validationMessages = new ValidationMessages(props);
        expect(validationMessages.warning).toEqual(["Warning 1"]);
    });

    it("should initialize with provided info messages", () => {
        const props = { info: ["Info 1", "Info 2", "Info 3"] };
        const validationMessages = new ValidationMessages(props);
        expect(validationMessages.info).toEqual(["Info 1", "Info 2", "Info 3"]);
    });

    it("should initialize with provided success messages", () => {
        const props = { success: ["Success 1"] };
        const validationMessages = new ValidationMessages(props);
        expect(validationMessages.success).toEqual(["Success 1"]);
    });

    it("should initialize with provided default messages", () => {
        const props = { default: ["Default 1", "Default 2"] };
        const validationMessages = new ValidationMessages(props);
        expect(validationMessages.default).toEqual(["Default 1", "Default 2"]);
    });

    it("should handle undefined props gracefully", () => {
        const validationMessages = new ValidationMessages();
        expect(validationMessages.error).toEqual([]);
        expect(validationMessages.warning).toEqual([]);
        expect(validationMessages.info).toEqual([]);
        expect(validationMessages.success).toEqual([]);
        expect(validationMessages.default).toEqual([]);
    });
});
