// Classes
import CustomComponent from "../CustomComponent.js";
import Part from "../../data-classes/Part.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

export default class CustomFieldPartNavn extends CustomComponent {
    constructor(element) {
        super(element);

        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;

        const formData = this.getFormDataFromProps(props);
        const isEmpty = !this.hasContent(formData);

        this.isEmpty = isEmpty;
        this.formData = formData;
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
     * Retrieves form data from the given element, formatting the name if necessary.
     *
     * If the `simpleBinding` property is already present in the element's form data, it returns the form data as is.
     * Otherwise, it constructs a new `Part` from the form data, formats the name, and returns it as `simpleBinding`.
     *
     * @param {Object} element - The element containing form data.
     * @param {Object} [element.formData] - The form data object.
     * @param {*} [element.formData.simpleBinding] - The simple binding value, if already set.
     * @param {*} [element.formData.data] - The data used to construct a new Part.
     * @returns {Object} The form data with a `simpleBinding` property.
     */
    getFormDataFromProps(element) {
        // If simpleBinding is already set, return it directly
        if (hasValue(element?.formData?.simpleBinding)) {
            return element.formData;
        }
        const data = element?.formData?.data;
        const part = new Part(data);
        const name = this.formatName(part, this.hideOrgNr);
        return {
            simpleBinding: name
        };
    }

    /**
     * Checks if the provided form data contains a value in the 'simpleBinding' property.
     *
     * @param {Object} formData - The form data object to check.
     * @returns {boolean} Returns true if 'simpleBinding' has a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData?.simpleBinding);
    }
}
