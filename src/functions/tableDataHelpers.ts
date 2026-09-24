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
 * @param sortKey - The key on each row object to sort by.
 * @param direction - The sort direction, "asc" (default) or "desc".
 * @param rows - The rows to sort. Anything that is not a list comes straight back.
 * @returns A new, sorted array (the input is left untouched). Non-array input is returned as-is.
 */
export function sortRowsByKey<T>(sortKey: string, direction: string | undefined, rows: T[]): T[];
export function sortRowsByKey(sortKey: string, direction: string | undefined, rows: unknown): unknown;
export function sortRowsByKey(sortKey: string, direction: string | undefined, rows: unknown): unknown {
    if (!Array.isArray(rows)) {
        return rows;
    }
    const directionFactor = direction === "desc" ? -1 : 1;
    return [...rows].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
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
 * @param rows - An array of rows, where each row is an array of cell objects.
 * @returns A new array containing only the non-empty rows (empty array for non-array input).
 */
export function removeEmptyRows(rows: unknown): unknown[] {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows
        .map((row) => {
            const notEmptyCells = row.filter((cell: unknown) => !instantiateComponent(cell)?.isEmpty);
            return notEmptyCells.length > 0 ? row : null;
        })
        .filter((row) => row !== null);
}
