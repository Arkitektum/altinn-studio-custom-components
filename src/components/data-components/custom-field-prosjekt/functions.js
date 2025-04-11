// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Formats a project object into a string containing the project name and project number (if available).
 *
 * @param {Object} prosjekt - The project object to format.
 * @param {string} [prosjekt.prosjektnavn] - The name of the project.
 * @param {number|string} [prosjekt.prosjektnr] - The project number.
 * @returns {string} A formatted string containing the project name and project number in parentheses,
 *                   separated by a space. If either is missing, it will be excluded from the result.
 */
export function formatProsjekt(prosjekt) {
    const prosjektnrString = hasValue(prosjekt?.prosjektnr) && `(${prosjekt.prosjektnr?.toString()})`;
    const prosjektParts = [prosjekt?.prosjektnavn?.toString(), prosjektnrString];
    return prosjektParts.filter((prosjektPart) => prosjektPart?.length).join(" ");
}
