// Classes
import CustomComponent from "../CustomComponent.js";
import Part from "../../data-classes/Part.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldPartNavn is a custom component class for handling and formatting part names,
 * optionally including organization numbers, and managing resource values for display.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including resource bindings and form data.
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Object} resourceValues - Contains localized resource values for title and data.
 * @property {string} resourceValues.title - The localized title for the component.
 * @property {string} resourceValues.data - The formatted name or empty field text.
 */
export default class CustomFieldPartNavn extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Formats the name of a part and optionally includes the organization number.
     *
     * @param {Object} part - The part object containing the name and organization number.
     * @param {string} part.navn - The name of the part.
     * @param {string} [part.organisasjonsnummer] - The organization number of the part.
     * @param {boolean} hideOrgNr - Flag to determine whether to hide the organization number.
     * @returns {string} The formatted name, optionally including the organization number.
     */
    formatName(part, hideOrgNr) {
        if (!part?.navn) {
            return "";
        }

        let result = part.navn;

        if (!hideOrgNr && part.organisasjonsnummer) {
            result += `\nOrganisasjonsnummer: ${part.organisasjonsnummer}`;
        }

        return result;
    }

    /**
     * Retrieves and formats the name value from the form data.
     *
     * @param {Object} props - The properties containing form data and component context.
     * @returns {string} The formatted name value based on the form data and configuration.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const part = new Part(data);
        const name = this.formatName(part, this.hideOrgNr);
        return name;
    }

    /**
     * Checks if the provided data contains a value in the 'simpleBinding' property.
     *
     * @param {Object} data - The data object to check.
     * @returns {boolean} Returns true if 'data' has a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }
}
