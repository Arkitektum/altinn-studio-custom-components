import { getFormDataCount } from "./functions";

describe("getFormDataCount", () => {
    it("should return the count of items in the data array when it exists and is an array", () => {
        const component = {
            formData: {
                data: [1, 2, 3]
            }
        };
        expect(getFormDataCount(component)).toBe(3);
    });

    it("should return 0 when the data property does not exist", () => {
        const component = {
            formData: {}
        };
        expect(getFormDataCount(component)).toBe(0);
    });

    it("should return 0 when the formData property does not exist", () => {
        const component = {};
        expect(getFormDataCount(component)).toBe(0);
    });

    it("should return 0 when the data property is not an array", () => {
        const component = {
            formData: {
                data: "not an array"
            }
        };
        expect(getFormDataCount(component)).toBe(0);
    });

    it("should return 0 when the component is null or undefined", () => {
        expect(getFormDataCount(null)).toBe(0);
        expect(getFormDataCount(undefined)).toBe(0);
    });
});
