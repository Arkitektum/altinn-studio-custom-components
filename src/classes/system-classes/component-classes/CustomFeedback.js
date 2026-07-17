// Dependencies

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.js";

/**
 * CustomFeedback is a custom component class that extends CustomComponent.
 * It initializes with form data, determines if the data is empty, and stores resource values.
 *
 * @extends CustomComponent
 * @class
 * @param {Object} props - The properties passed to the component.
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {Object} resourceValues - Contains the data value for the component.
 */
export default class CustomFeedback extends CustomComponent {
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
     * Retrieves the value for the component from the provided form data props.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }
}
