// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

/**
 * Represents custom paragraph text data for a component.
 * Extends the CustomComponent class to provide specialized handling of paragraph text,
 * including resource value retrieval, content checking, and formatted data combination.
 *
 * @class
 * @extends CustomComponent
 */
export default class CustomParagraphTextData extends CustomComponent {
    constructor(props) {
        super(props);
        const formData = this.getValueFromFormData(props);
        const bodyResourceValue = getComponentResourceValue(props, "body");
        const data = this.getTextDataCombination(formData, bodyResourceValue);
        const isEmpty = !this.hasContent(formData);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided form data value contains content.
     *
     * @param {*} formDataValue - The value from the form data to check.
     * @returns {boolean} Returns true if the value has content, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Combines the provided body resource value and form data into a single trimmed string.
     * If the resulting string is not empty, appends a period at the end.
     * Returns an empty string if the combination is empty.
     *
     * @param {string} formData - The form data to be included in the combination.
     * @param {string} bodyResourceValue - The body resource value to be included in the combination.
     * @returns {string} The combined string with a period, or an empty string if the combination is empty.
     */
    getTextDataCombination(formData, bodyResourceValue) {
        const textDataCombination = `${bodyResourceValue} ${formData}`.trim();
        return textDataCombination?.length > 0 ? `${textDataCombination}.` : "";
    }

    /**
     * Retrieves and formats the value from the provided form data props.
     *
     * @param {Object} props - The properties containing form data and formatting options.
     * @returns {string} The formatted value extracted from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return formatString(data, props?.format);
    }
}
