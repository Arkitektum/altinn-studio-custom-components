/**
 * Formats the given kommunensSaksnummer object into a string.
 * The format is "saksaar/sakssekvensnummer".
 *
 * @param {Object} kommunensSaksnummer - The object containing saksaar and sakssekvensnummer.
 * @param {number} kommunensSaksnummer.saksaar - The year part of the saksnummer.
 * @param {number} kommunensSaksnummer.sakssekvensnummer - The sequence number part of the saksnummer.
 * @returns {string} The formatted kommunensSaksnummer string.
 */
export function formatKommunensSaksnummer(kommunensSaksnummer) {
    const kommunensSaksnummerParts = [kommunensSaksnummer?.saksaar?.toString(), kommunensSaksnummer?.sakssekvensnummer?.toString()];
    return kommunensSaksnummerParts.filter((kommunensSaksnummerPart) => kommunensSaksnummerPart?.length).join("/");
}
