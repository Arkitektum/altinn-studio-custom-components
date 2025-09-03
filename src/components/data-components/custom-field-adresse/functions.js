/**
 * Formats an address object into a single string with non-empty address lines separated by newlines.
 *
 * @param {Object} adresse - The address object containing address lines.
 * @param {string} [adresse.adresselinje1] - The first line of the address.
 * @param {string} [adresse.adresselinje2] - The second line of the address.
 * @param {string} [adresse.adresselinje3] - The third line of the address.
 * @returns {string} A formatted string with non-empty address lines separated by newline characters.
 */
function formatAdresselinje(adresse) {
    const adresseLinjer = [adresse.adresselinje1, adresse.adresselinje2, adresse.adresselinje3];
    return adresseLinjer.filter((adresselinje) => adresselinje?.length).join("\n");
}

/**
 * Formats the zip code and city from an address object into a single string.
 *
 * @param {Object} adresse - The address object containing postal information.
 * @param {string} adresse.postnr - The postal code.
 * @param {string} adresse.poststed - The city name.
 * @returns {string} A formatted string combining the postal code and city, separated by a space.
 *                   If either the postal code or city is missing, it will be omitted from the result.
 */
function formatZipCity(adresse) {
    const zipCity = [adresse.postnr, adresse.poststed];
    return zipCity.filter((zipCity) => zipCity?.length).join(" ");
}

/**
 * Formats an address object into a into a single string.
 *
 * @param {Adresse} adresse - The address object to format.
 * @returns {string} The formatted address string.
 */
export function formatAdresse(adresse) {
    const adresseLinje = formatAdresselinje(adresse);
    const zipCity = formatZipCity(adresse);
    return adresseLinje?.length ? `${adresseLinje}\n${zipCity}` : zipCity;
}
