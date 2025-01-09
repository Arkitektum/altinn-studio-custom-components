/**
 * Returns the status text based on the provided `utfallSvar` object.
 *
 * @param {Object} utfallSvar - The object containing the status information.
 * @param {boolean} utfallSvar.erUtfallBesvaresSenere - Indicates if the response will be provided later.
 * @param {boolean} utfallSvar.erUtfallBesvart - Indicates if the response has already been submitted.
 * @returns {string} The status text corresponding to the provided `utfallSvar` object.
 */
export function getStatusText(utfallSvar) {
    // TODO: Add support for text resources
    if (utfallSvar?.erUtfallBesvaresSenere) {
        return "Besvares senere";
    } else if (utfallSvar?.erUtfallBesvart) {
        return "Svar innsendt tidligere";
    } else {
        return "Besvares nå";
    }
}
