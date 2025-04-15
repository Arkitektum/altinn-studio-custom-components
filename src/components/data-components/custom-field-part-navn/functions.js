/**
 * Formats the name of a part and optionally includes the organization number.
 *
 * @param {Object} part - The part object containing the name and organization number.
 * @param {string} part.navn - The name of the part.
 * @param {string} [part.organisasjonsnummer] - The organization number of the part.
 * @param {boolean} hideOrgNr - Flag to determine whether to hide the organization number.
 * @returns {string} The formatted name, optionally including the organization number.
 */
export function formatName(part, hideOrgNr) {
    if (!part?.navn) {
        return "";
    }

    let result = part.navn;

    if (!hideOrgNr && part.organisasjonsnummer) {
        result += `\nOrganisasjonsnummer: ${part.organisasjonsnummer}`;
    }

    return result;
}
