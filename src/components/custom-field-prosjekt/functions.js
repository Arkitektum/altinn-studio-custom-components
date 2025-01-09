/**
 * Formats a project object into a string containing the project name and project number.
 *
 * @param {Object} prosjekt - The project object to format.
 * @param {string} prosjekt.prosjektnavn - The name of the project.
 * @param {string} [prosjekt.prosjektnr] - The number of the project.
 * @returns {string} The formatted project string.
 */
export function formatProsjekt(prosjekt) {
    const prosjektnrString = prosjekt?.prosjektnr?.length && `(${prosjekt.prosjektnr})`;
    const prosjektParts = [prosjekt?.prosjektnavn, prosjektnrString];
    return prosjektParts.filter((prosjektPart) => prosjektPart?.length).join(" ");
}
