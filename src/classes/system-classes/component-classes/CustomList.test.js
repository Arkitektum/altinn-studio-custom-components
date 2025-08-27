import CustomList from "./CustomList";
import CustomComponent from "../CustomComponent";
import { hasValue } from "../../../functions/helpers";

// Mock hasValue helper
jest.mock("../../../functions/helpers", () => ({
    hasValue: jest.fn()
}));

describe("CustomList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomList({});
        expect(instance).toBeInstanceOf(CustomComponent);
    });

    it("should set isEmpty from props if provided", () => {
        const instance = new CustomList({ isEmpty: true });
        expect(instance.isEmpty).toBe(true);

        const instance2 = new CustomList({ isEmpty: false });
        expect(instance2.isEmpty).toBe(false);
    });

    it("should set isEmpty based on hasContent if isEmpty is not provided", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomList({ resourceValues: { data: [1, 2, 3] } });
        expect(instance.isEmpty).toBe(false);

        hasValue.mockReturnValue(false);
        const instance2 = new CustomList({ resourceValues: { data: [] } });
        expect(instance2.isEmpty).toBe(true);
    });

    it("should set resourceValues from props or default to {}", () => {
        const instance = new CustomList({ resourceValues: { data: [1] } });
        expect(instance.resourceValues).toEqual({ data: [1] });

        const instance2 = new CustomList({});
        expect(instance2.resourceValues).toEqual({});
    });

    describe("hasContent", () => {
        it("should call hasValue with resourceValues.data", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomList({});
            const props = { resourceValues: { data: [1, 2] } };
            instance.hasContent(props);
            expect(hasValue).toHaveBeenCalledWith([1, 2]);
        });

        it("should return the result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomList({});
            expect(instance.hasContent({ resourceValues: { data: [1] } })).toBe(true);

            hasValue.mockReturnValue(false);
            expect(instance.hasContent({ resourceValues: { data: [] } })).toBe(false);
        });

        it("should handle missing resourceValues gracefully", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomList({});
            expect(instance.hasContent({})).toBe(false);
            expect(hasValue).toHaveBeenCalledWith(undefined);
        });
    });
});
