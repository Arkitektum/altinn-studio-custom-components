// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";
import ValidationMessages from "../ValidationMessages.js";

/**
 * CustomFeedbacklistValidationMessages is a custom component class responsible for handling
 * validation messages for feedback lists. It extends the CustomComponent base class and
 * initializes its state based on the provided props, extracting validation messages and
 * determining if the data is empty.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component, typically including form data.
 *
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {Object} resourceValues - Contains the validation messages data.
 */
export default class CustomFeedbacklistValidationMessages extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            data
        };
    }

    /**
     * Checks if the provided data has a value.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} Returns true if the data has a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves the component data value from the provided props and returns it as a ValidationMessages instance.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {ValidationMessages} An instance of ValidationMessages initialized with the component data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return new ValidationMessages(data);
    }
}
