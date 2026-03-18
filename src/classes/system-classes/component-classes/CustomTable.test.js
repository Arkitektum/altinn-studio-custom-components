import CustomComponent from "../CustomComponent";
import CustomTable from "./CustomTable";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const table = new CustomTable({});
        expect(table instanceof CustomComponent).toBe(true);
    });

    it("should set resourceValues from props", () => {
        const props = { resourceValues: { data: "abc" } };
        const table = new CustomTable(props);
        expect(table.resourceValues).toEqual(props.resourceValues);
    });

    it("should default resourceValues to empty object if not provided", () => {
        const table = new CustomTable({});
        expect(table.resourceValues).toEqual({});
    });

    it("should set isEmpty to false if resourceValues.data has value", () => {
        hasValue.mockReturnValue(true);
        const props = { resourceValues: { data: "abc" } };
        const table = new CustomTable(props);
        expect(table.isEmpty).toBe(false);
    });

    it("should set isEmpty to true if resourceValues.data is missing", () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { data: null } };
        const table = new CustomTable(props);
        expect(table.isEmpty).toBe(true);
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const table = new CustomTable({});
            expect(table.hasContent({ resourceValues: { data: "abc" } })).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const table = new CustomTable({});
            expect(table.hasContent({ resourceValues: { data: null } })).toBe(false);
        });

        it("should handle missing resourceValues gracefully", () => {
            hasValue.mockReturnValue(false);
            const table = new CustomTable({});
            expect(table.hasContent({})).toBe(false);
        });
    });
});
