import { getTitleForFeedbackType } from "./functions";

describe("getTitleForFeedbackType", () => {
    it('should return "Errors (3)" when feedbackType is "error" and feedbackCount is 3', () => {
        const result = getTitleForFeedbackType("error", 3);
        expect(result).toBe("Errors (3)");
    });

    it('should return "Warnings (5)" when feedbackType is "warning" and feedbackCount is 5', () => {
        const result = getTitleForFeedbackType("warning", 5);
        expect(result).toBe("Warnings (5)");
    });

    it('should return "Information (2)" when feedbackType is "info" and feedbackCount is 2', () => {
        const result = getTitleForFeedbackType("info", 2);
        expect(result).toBe("Information (2)");
    });

    it('should return "Messages (0)" when feedbackType is an unknown type and feedbackCount is 0', () => {
        const result = getTitleForFeedbackType("unknown", 0);
        expect(result).toBe("Messages (0)");
    });

    it('should return "Messages (10)" when feedbackType is undefined and feedbackCount is 10', () => {
        const result = getTitleForFeedbackType(undefined, 10);
        expect(result).toBe("Messages (10)");
    });

    it('should return "Messages (1)" when feedbackType is null and feedbackCount is 1', () => {
        const result = getTitleForFeedbackType(null, 1);
        expect(result).toBe("Messages (1)");
    });
});
