import { getComponentTexts, validateTexts } from "../../../functions/helpers.js";

/**
 * Retrieves the appropriate text based on the boolean value of the data.
 *
 * @param {boolean|string} data - The boolean value or string representation of the boolean value.
 * @param {HTMLElement} component - The component element from which to retrieve the texts.
 * @returns {Promise<string>} - A promise that resolves to the appropriate text based on the boolean value.
 */

export async function getBooleanText(data, component) {
    const componentName = component?.id || "custom-field-boolean-text";
    const texts = await getComponentTexts(component);
    const textKeys = ["trueText", "falseText", "defaultText"];
    const fallbackTexts = {
        trueText: "Ja",
        falseText: "Nei",
        defaultText: ""
    };
    validateTexts(texts, fallbackTexts, textKeys, componentName);
    if (data === true || data === "true") {
        return texts?.trueText !== undefined && texts.trueText !== null ? texts.trueText : fallbackTexts.trueText;
    } else if (data === false || data === "false") {
        return texts?.falseText !== undefined && texts.falseText !== null ? texts.falseText : fallbackTexts.falseText;
    } else {
        return texts?.defaultText ? texts.defaultText : fallbackTexts.defaultText;
    }
}
