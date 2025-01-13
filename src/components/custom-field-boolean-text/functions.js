import { getAsync, validateTexts } from "../../functions/helpers";

/**
 * Retrieves the appropriate text based on the boolean value of the data.
 *
 * @param {boolean|string} data - The boolean value or string representation of the boolean value.
 * @param {HTMLElement} component - The component element from which to retrieve the texts.
 * @returns {Promise<string>} - A promise that resolves to the appropriate text based on the boolean value.
 */

export async function getBooleanText(data, component) {
    const componentId = component.getAttribute("id");
    const texts = await getAsync(component, "texts");
    const textKeys = ["trueText", "falseText", "defaultText"];
    const fallbackTexts = {
        trueText: "Ja",
        falseText: "Nei",
        defaultText: ""
    };
    validateTexts(texts, fallbackTexts, textKeys, componentId);
    if (data === true || data === "true") {
        return texts?.trueText ? texts.trueText : fallbackTexts.trueText;
    } else if (data === false || data === "false") {
        return texts?.falseText ? texts.falseText : fallbackTexts.falseText;
    } else {
        return texts?.defaultText ? texts.defaultText : fallbackTexts.defaultText;
    }
}
