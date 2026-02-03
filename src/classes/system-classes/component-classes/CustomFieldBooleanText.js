// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import {
    getComponentBooleanTextValues,
    getComponentDataValue,
    getComponentResourceValue,
    getTextResourceFromResourceBinding,
    hasValue
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
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings?.booleanText);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && getComponentResourceValue(props, "title"),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.booleanText?.emptyFieldText) : data
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
     * Retrieves the appropriate boolean text value from form data based on the component's condition.
     *
     * @param {Object} component - The component object containing form data and configuration.
     * @param {Object} resourceBindings - The resource bindings used to resolve text values.
     * @returns {string} The text corresponding to the boolean value: trueText, falseText, or defaultText.
     */
    getValueFromFormData(component, resourceBindings) {
        const condition = getComponentDataValue(component);
        const booleanTextValues = getComponentBooleanTextValues(component, resourceBindings);
        if (condition === true || condition === "true") {
            return booleanTextValues?.trueText;
        } else if (condition === false || condition === "false") {
            return booleanTextValues?.falseText;
        } else {
            return booleanTextValues?.defaultText;
        }
    }

    /**
     * Generates resource bindings for boolean text fields based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource bindings for text values.
     * @param {string} [props.resourceBindings.trueText] - Text to display for true value.
     * @param {string} [props.resourceBindings.falseText] - Text to display for false value.
     * @param {string} [props.resourceBindings.defaultText] - Default text to display.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when field is empty.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text.
     * @returns {Object} Resource bindings object for boolean text.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            booleanText: {
                trueText: props?.resourceBindings?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.falseText || "resource.falseText.default",
                defaultText: props?.resourceBindings?.defaultText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.booleanText = {
                ...resourceBindings.booleanText,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
