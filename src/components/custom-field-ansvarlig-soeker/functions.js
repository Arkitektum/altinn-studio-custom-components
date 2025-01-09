/**
 * Formats the name and organizational number of the responsible applicant.
 *
 * @param {Object} ansvarligSoeker - The responsible applicant object.
 * @param {string} ansvarligSoeker.navn - The name of the responsible applicant.
 * @param {string} [ansvarligSoeker.organisasjonsnummer] - The organizational number of the responsible applicant.
 * @returns {string} The formatted name and organizational number.
 */
export function formatName(ansvarligSoeker) {
    let name = ansvarligSoeker?.navn || "";
    name += ansvarligSoeker?.organisasjonsnummer?.length
        ? `\n Organisasjonsnummer: ${ansvarligSoeker.organisasjonsnummer}`
        : "";
    return name;
}
