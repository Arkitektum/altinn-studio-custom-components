import Adresse from "../../../classes/data-classes/Adresse.js";

function formatAdresselinje(adresse) {
    const adresseLinjer = [adresse.adresselinje1, adresse.adresselinje2, adresse.adresselinje3];
    return adresseLinjer.filter((adresselinje) => adresselinje?.length).join("\n");
}

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
