/**
 * Returns the status text based on the provided `utfallSvar` object.
 *
 * @param {Object} utfallSvar - The object containing the status information.
 * @param {boolean} utfallSvar.erUtfallBesvaresSenere - Indicates if the response will be provided later.
 * @param {boolean} utfallSvar.erUtfallBesvart - Indicates if the response has already been submitted.
 * @param {HTMLElement} component - The component element.
 * @returns {string} The status text corresponding to the provided `utfallSvar` object.
 */

import { getAsync, validateTexts } from "../../functions/helpers";

export async function getStatusText(utfallSvar, component) {
    const componentId = component.getAttribute("id");
    const texts = await getAsync(component, "texts");
    const textKeys = ["erUtfallBesvaresSenere", "erUtfallBesvart", "status"];
    const fallbackTexts = {
        erUtfallBesvaresSenere: "Besvares senere",
        erUtfallBesvart: "Svar innsendt tidligere",
        status: "Besvares nå"
    };
    validateTexts(texts, fallbackTexts, textKeys, componentId);
    if (utfallSvar?.erUtfallBesvaresSenere) {
        return texts?.erUtfallBesvaresSenere ? texts.erUtfallBesvaresSenere : fallbackTexts.erUtfallBesvaresSenere;
    } else if (utfallSvar?.erUtfallBesvart) {
        return texts?.erUtfallBesvart ? texts.erUtfallBesvart : fallbackTexts.erUtfallBesvart;
    } else {
        return texts?.status ? texts.status : fallbackTexts.status;
    }
}
