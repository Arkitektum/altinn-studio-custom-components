// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import {
    getComponentBooleanTextValues,
    getComponentDataValue,
    getComponentResourceValue,
    hasValue,
    validateTexts
} from "../../../functions/helpers.js";

/**
 * CustomFieldBooleanText is a custom component class for rendering boolean values as text.
 * It determines the display text based on the boolean value from the component's form data,
 * and supports customizable resource values for title and empty field text.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The unique identifier for the component.
 * @param {Object} props.formData - The form data containing the value for this component.
 * @param {Object} props.resources - Resource values for localization (e.g., title, emptyFieldText).
 *
 * @property {boolean} isEmpty - Indicates if the component's value is empty.
 * @property {Object} resourceValues - Contains the title and data text to display.
 *
 */
export default class CustomFieldBooleanText extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Determines if the provided data has content by delegating to the hasValue function.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content; otherwise, false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves the appropriate text value based on the boolean condition from the component's form data.
     *
     * @param {Object} component - The component object containing form data and configuration.
     * @param {string} [component.id] - The unique identifier for the component.
     * @returns {string} The text value corresponding to the boolean condition ("trueText", "falseText", or "defaultText").
     *
     * @throws {Error} If the text values are invalid as determined by `validateTexts`.
     */
    getValueFromFormData(component) {
        const componentName = component?.id || "custom-field-boolean-text";
        const condition = getComponentDataValue(component);
        const booleanTextValues = getComponentBooleanTextValues(component);
        const textKeys = ["trueText", "falseText", "defaultText"];
        const fallbackTexts = {
            trueText: "Ja",
            falseText: "Nei",
            defaultText: ""
        };
        validateTexts(booleanTextValues, fallbackTexts, textKeys, componentName);
        if (condition === true || condition === "true") {
            return booleanTextValues?.trueText !== undefined && booleanTextValues.trueText !== null
                ? booleanTextValues.trueText
                : fallbackTexts.trueText;
        } else if (condition === false || condition === "false") {
            return booleanTextValues?.falseText !== undefined && booleanTextValues.falseText !== null
                ? booleanTextValues.falseText
                : fallbackTexts.falseText;
        } else {
            return booleanTextValues?.defaultText ? booleanTextValues.defaultText : fallbackTexts.defaultText;
        }
    }
}
