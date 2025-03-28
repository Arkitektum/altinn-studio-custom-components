/**
 * Formats the name and organizational number (optional) of the part.
 *
 * @param {Object} part - The responsible part object.
 * @param {string} part.navn - The name of the part.
 * @param {string} part.organisasjonsnummer - The organizational number of the part.
 * @param {boolean} hideOrgNr - don't append organization number if set to true
 * @returns {string} The formatted name and organizational number.
 */
export function formatName(part, hideOrgNr) {
    let name = part?.navn || "";

    if (hideOrgNr) return name;

    name += part?.organisasjonsnummer?.length ? `\nOrganisasjonsnummer: ${part.organisasjonsnummer}` : "";

    return name;
}
