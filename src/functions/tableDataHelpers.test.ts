import { removeEmptyRows, sortRowsByKey } from "./tableDataHelpers.ts";
import { instantiateComponent } from "./componentHelpers.ts";

jest.mock("./componentHelpers.ts", () => ({
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

    it("treats partially-numeric strings as text, not numbers", () => {
        // "12abc" is not a full number, so it is compared as text rather than as 12. The text comparison still reads the
        // digits it starts with by value, which is why "3" comes first.
        const rows = [{ v: "12abc" }, { v: "3" }];
        expect(sortRowsByKey("v", "asc", rows)).toEqual([{ v: "3" }, { v: "12abc" }]);
    });

    it("sorts text the Norwegian way, with Æ, Ø and Å after Z", () => {
        const rows = ["Ål", "Østre", "Zinken", "Æra", "Aker"].map((v) => ({ v }));
        expect(sortRowsByKey("v", "asc", rows).map((row) => row.v)).toEqual(["Aker", "Zinken", "Æra", "Østre", "Ål"]);
    });

    it("sorts a capital beside its small letter rather than before every small letter", () => {
        const rows = ["berg", "Bygg", "bakke", "Aker"].map((v) => ({ v }));
        expect(sortRowsByKey("v", "asc", rows).map((row) => row.v)).toEqual(["Aker", "bakke", "berg", "Bygg"]);
    });

    it("sorts a number inside text by its value", () => {
        const rows = ["Bygg 10", "Bygg 2", "Bygg 1"].map((v) => ({ v }));
        expect(sortRowsByKey("v", "asc", rows).map((row) => row.v)).toEqual(["Bygg 1", "Bygg 2", "Bygg 10"]);
        expect(sortRowsByKey("v", "desc", rows).map((row) => row.v)).toEqual(["Bygg 10", "Bygg 2", "Bygg 1"]);
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
        jest.mocked(instantiateComponent).mockImplementation((cell) => ({ isEmpty: (cell as { isEmpty?: boolean }).isEmpty }));
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
