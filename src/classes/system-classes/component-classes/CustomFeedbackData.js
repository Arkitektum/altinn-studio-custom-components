// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFeedbackData is a custom component class that handles feedback data.
 * It extends the CustomComponent class and manages the retrieval and validation
 * of data from form props.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties containing form data and context.
 * @property {boolean} isEmpty - Indicates whether the feedback data is empty.
 * @property {Object} resourceValues - Contains the feedback data.
 */
export default class CustomFeedbackData extends CustomComponent {
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
     * Retrieves the value for this component from the provided form data props.
     *
     * @param {Object} props - The properties containing form data and context.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }
}
