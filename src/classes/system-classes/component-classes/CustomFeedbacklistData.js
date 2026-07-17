// Dependencies

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.js";

/**
 * CustomFeedbacklistData is a custom component class for handling feedback list data.
 * It extends the CustomComponent class and manages resource values and content state.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including resource values and form data.
 * @property {boolean} isEmpty - Indicates whether the feedback list data is empty.
 * @property {Object} resourceValues - Contains the title and data for the feedback list.
 * @property {string} resourceValues.title - The title for the feedback list, defaults to "Messages".
 * @property {*} resourceValues.data - The feedback list data extracted from form data.
 */
export default class CustomFeedbacklistData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: props?.resourceValues?.title || "Messages",
            data
        };
    }

    /**
     * Retrieves the value for the component from the provided form data props.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-feedback-data"];
    }
}
