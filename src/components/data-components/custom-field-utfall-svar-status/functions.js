import { getComponentTexts, validateTexts } from "../../../functions/helpers.js";

/**
 * Returns the status text based on the provided `utfallSvarStatus` object.
 *
 * @param {Object} utfallSvarStatus - The object containing the status information.
 * @param {boolean} utfallSvarStatus.erUtfallBesvaresSenere - Indicates if the response will be provided later.
 * @param {boolean} utfallSvarStatus.erUtfallBesvart - Indicates if the response has already been submitted.
 * @param {HTMLElement} component - The component element.
 * @returns {Promise<string>} A promise that resolves a status text corresponding to the provided `utfallSvarStatus` object.
 */

export async function getStatusText(utfallSvarStatus, component) {
    const componentId = component.getAttribute("id");
    const texts = await getComponentTexts(component);
    const textKeys = ["erUtfallBesvaresSenere", "erUtfallBesvart", "status"];
    const fallbackTexts = {
        erUtfallBesvaresSenere: "Besvares senere",
        erUtfallBesvart: "Svar innsendt tidligere",
        status: "Besvares nå"
    };
    validateTexts(texts, fallbackTexts, textKeys, componentId);
    if (utfallSvarStatus?.erUtfallBesvaresSenere) {
        return texts?.erUtfallBesvaresSenere !== undefined && texts?.erUtfallBesvaresSenere !== null
            ? texts.erUtfallBesvaresSenere
            : fallbackTexts.erUtfallBesvaresSenere;
    } else if (utfallSvarStatus?.erUtfallBesvart) {
        return texts?.erUtfallBesvart !== undefined && texts?.erUtfallBesvart !== null ? texts.erUtfallBesvart : fallbackTexts.erUtfallBesvart;
    } else {
        return texts?.status ? texts.status : fallbackTexts.status;
    }
}
