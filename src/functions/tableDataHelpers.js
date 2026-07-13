// Global functions
import { instantiateComponent } from "./componentHelpers.js";

/**
 * Sorts a shallow copy of the provided rows by a key, so the caller's array (often a reference into the
 * form data) is never mutated.
 *
 * Values that fully parse as numbers are compared numerically; everything else is compared as strings.
 * `Number` is used (not `parseFloat`) so partial matches like "12abc" are treated as strings rather than 12,
 * and null/undefined are treated as empty strings. Shared by the table and matrix data components.
 *
 * @param {string} sortKey - The key on each row object to sort by.
 * @param {string} direction - The sort direction, "asc" (default) or "desc".
 * @param {Array<Object>} rows - The rows to sort.
 * @returns {Array<Object>} A new, sorted array (the input is left untouched). Non-array input is returned as-is.
 */
export function sortRowsByKey(sortKey, direction, rows) {
    if (!Array.isArray(rows)) {
        return rows;
    }
    const directionFactor = direction === "desc" ? -1 : 1;
    return [...rows].sort((a, b) => {
        const aValue = a?.[sortKey];
        const bValue = b?.[sortKey];

        const aNumber = Number(aValue);
        const bNumber = Number(bValue);
        const aIsNumber = aValue !== null && aValue !== undefined && aValue !== "" && !Number.isNaN(aNumber);
        const bIsNumber = bValue !== null && bValue !== undefined && bValue !== "" && !Number.isNaN(bNumber);

        if (aIsNumber && bIsNumber) {
            if (aNumber < bNumber) return -1 * directionFactor;
            if (aNumber > bNumber) return 1 * directionFactor;
            return 0;
        }

        // Fall back to string comparison, treating null/undefined as an empty string.
        const aString = aValue === null || aValue === undefined ? "" : String(aValue);
        const bString = bValue === null || bValue === undefined ? "" : String(bValue);
        if (aString < bString) return -1 * directionFactor;
        if (aString > bString) return 1 * directionFactor;
        return 0;
    });
}

/**
 * Removes rows whose cells are all empty. A cell is considered empty when its instantiated component reports
 * `isEmpty`. Shared by the table and matrix data components.
 *
 * @param {Array<Array<any>>} rows - An array of rows, where each row is an array of cell objects.
 * @returns {Array<Array<any>>} A new array containing only the non-empty rows (empty array for non-array input).
 */
export function removeEmptyRows(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows
        .map((row) => {
            const notEmptyCells = row.filter((cell) => !instantiateComponent(cell)?.isEmpty);
            return notEmptyCells.length > 0 ? row : null;
        })
        .filter((row) => row !== null);
}
