// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataTitle, getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

/**
 * CustomFieldData is a class that extends CustomComponent to handle custom field data logic.
 * It initializes resource values based on the presence of content in the form data and manages
 * display properties such as title and empty field text.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the custom field component.
 * @param {boolean} [props.hideTitle] - Determines if the title should be hidden.
 * @param {Object} [props.resourceBindings] - Resource bindings for the component.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource key for empty field text.
 *
 * @property {boolean} isEmpty - Indicates if the field data is empty.
 * @property {Object} resourceValues - Contains the title and data to be displayed.
 * @property {string|undefined} resourceValues.title - The title of the component, if not hidden.
 * @property {*} resourceValues.data - The data to display, or empty field text if no data.
 */
export default class CustomFieldData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const dataTitle = getComponentDataTitle(props);
        const isEmpty = !this.hasContent(data);
        const isDataTitleEmpty = !this.hasContent(dataTitle);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && ((!isDataTitleEmpty && dataTitle) || getComponentResourceValue(props, "title")),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
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
