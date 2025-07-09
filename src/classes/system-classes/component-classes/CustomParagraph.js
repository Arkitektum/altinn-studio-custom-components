// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomParagraph is a custom component class that represents a paragraph element.
 * It extends the CustomComponent class and manages resource values, specifically the 'title'.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {Object} [props.resourceValues] - An optional object containing resource values.
 * @param {string} [props.resourceValues.title] - The title to be displayed in the paragraph.
 *
 * @property {boolean} isEmpty - Indicates whether the paragraph has content.
 * @property {Object} resourceValues - Stores the resource values passed in props.
 */
export default class CustomParagraph extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = !this.hasContent(props);
        this.resourceValues = props?.resourceValues;
    }

    /**
     * Checks if the provided props object contains a non-empty 'title' in 'resourceValues'.
     *
     * @param {Object} props - The properties object to check.
     * @param {Object} [props.resourceValues] - An optional object containing resource values.
     * @param {string} [props.resourceValues.title] - The title to check for content.
     * @returns {boolean} Returns true if 'title' has a value, otherwise false.
     */
    hasContent(props) {
        return hasValue(props?.resourceValues?.title);
    }
}
