import { getListItemsFromKey } from "./functions";

describe("getListItemsFromKey", () => {
    it("should extract values for the specified key from a list of objects", () => {
        const items = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
            { id: 3, name: "Charlie" }
        ];
        const result = getListItemsFromKey(items, "name");
        expect(result).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("should return an empty array if the input list is empty", () => {
        const items = [];
        const result = getListItemsFromKey(items, "name");
        expect(result).toEqual([]);
    });

    it("should return undefined for objects that do not have the specified key", () => {
        const items = [{ id: 1 }, { id: 2, name: "Bob" }, { id: 3 }];
        const result = getListItemsFromKey(items, "name");
        expect(result).toEqual([undefined, "Bob", undefined]);
    });

    it("should handle null or undefined items in the list gracefully", () => {
        const items = [null, { id: 2, name: "Bob" }, undefined];
        const result = getListItemsFromKey(items, "name");
        expect(result).toEqual([undefined, "Bob", undefined]);
    });

    it("should return an array of undefined if the key is not provided", () => {
        const items = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" }
        ];
        const result = getListItemsFromKey(items);
        expect(result).toEqual([undefined, undefined]);
    });
});
