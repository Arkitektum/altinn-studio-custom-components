import { removeEmptyRows, sortRowsByKey } from "./tableDataHelpers";
import { instantiateComponent } from "./componentHelpers.js";

jest.mock("./componentHelpers.js", () => ({
    instantiateComponent: jest.fn()
}));

describe("sortRowsByKey", () => {
    it("sorts numeric string values ascending", () => {
        const rows = [{ age: "12" }, { age: "2" }, { age: "10" }];
        expect(sortRowsByKey("age", "asc", rows)).toEqual([{ age: "2" }, { age: "10" }, { age: "12" }]);
    });

    it("sorts numeric string values descending", () => {
        const rows = [{ age: "12" }, { age: "2" }, { age: "10" }];
        expect(sortRowsByKey("age", "desc", rows)).toEqual([{ age: "12" }, { age: "10" }, { age: "2" }]);
    });

    it("sorts string values", () => {
        const rows = [{ name: "A" }, { name: "C" }, { name: "B" }];
        expect(sortRowsByKey("name", "asc", rows)).toEqual([{ name: "A" }, { name: "B" }, { name: "C" }]);
        expect(sortRowsByKey("name", "desc", rows)).toEqual([{ name: "C" }, { name: "B" }, { name: "A" }]);
    });

    it("does not mutate the input array", () => {
        const rows = [{ age: "3" }, { age: "1" }, { age: "2" }];
        const snapshot = [...rows];
        sortRowsByKey("age", "asc", rows);
        expect(rows).toEqual(snapshot);
    });

    it("treats partially-numeric strings as strings, not numbers", () => {
        // "12abc" is not a full number, so it is compared as a string ("1" < "3"), unlike parseFloat which would yield 12.
        const rows = [{ v: "3" }, { v: "12abc" }];
        expect(sortRowsByKey("v", "asc", rows)).toEqual([{ v: "12abc" }, { v: "3" }]);
    });

    it("treats null/undefined values as empty strings", () => {
        const rows = [{ v: "b" }, { v: null }, { v: undefined }];
        const result = sortRowsByKey("v", "asc", rows);
        expect(result[result.length - 1]).toEqual({ v: "b" });
    });

    it("returns non-array input unchanged", () => {
        expect(sortRowsByKey("v", "asc", null)).toBeNull();
        expect(sortRowsByKey("v", "asc", undefined)).toBeUndefined();
    });
});

describe("removeEmptyRows", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        instantiateComponent.mockImplementation((cell) => ({ isEmpty: cell.isEmpty }));
    });

    it("removes rows where all cells are empty", () => {
        const rows = [
            [{ isEmpty: true }, { isEmpty: true }],
            [{ isEmpty: false }, { isEmpty: true }],
            [{ isEmpty: false }, { isEmpty: false }]
        ];
        const result = removeEmptyRows(rows);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual([{ isEmpty: false }, { isEmpty: true }]);
    });

    it("keeps a row with at least one non-empty cell intact", () => {
        const rows = [[{ isEmpty: false }, { isEmpty: true }]];
        expect(removeEmptyRows(rows)).toEqual(rows);
    });

    it("returns an empty array for non-array input", () => {
        expect(removeEmptyRows(null)).toEqual([]);
        expect(removeEmptyRows(undefined)).toEqual([]);
    });
});
