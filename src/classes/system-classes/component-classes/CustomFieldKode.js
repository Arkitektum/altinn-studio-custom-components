// Classes
import CustomComponent from "../CustomComponent.js";
import Kode from "../../data-classes/Kode.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldKode is a custom component class for handling and formatting code fields.
 * It extends the CustomComponent base class and provides methods for checking content,
 * formatting code objects, and retrieving formatted values from form data.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties containing form data and component information.
 * @property {boolean} isEmpty - Indicates whether the field data is empty.
 * @property {Object} resourceValues - Contains resource values for title and data.
 * @property {string} resourceValues.title - The resource value for the component title.
 * @property {string} resourceValues.data - The formatted code value or empty field text.
 */
export default class CustomFieldKode extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data value has content.
     *
     * @param {*} data - The value from the data to check.
     * @returns {boolean} Returns true if the data value has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Formats a kode object by combining its value and description.
     *
     * If both `kodeverdi` and `kodebeskrivelse` are present, returns them as
     * "<kodeverdi>: <kodebeskrivelse>". If only one is present, returns that one.
     * Returns an empty string if neither is present.
     *
     * @param {Object} kode - The kode object to format.
     * @param {string} [kode.kodeverdi] - The code value.
     * @param {string} [kode.kodebeskrivelse] - The code description.
     * @returns {string} The formatted kode string.
     */
    formatKode(kode) {
        if (hasValue(kode?.kodeverdi) && hasValue(kode?.kodebeskrivelse)) {
            return `${kode.kodeverdi}: ${kode.kodebeskrivelse}`;
        } else if (hasValue(kode?.kodeverdi)) {
            return kode.kodeverdi;
        } else if (hasValue(kode?.kodebeskrivelse)) {
            return kode.kodebeskrivelse;
        }
        return "";
    }

    /**
     * Retrieves and formats the value from form data for the custom field.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {string} The formatted code value extracted from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const kode = new Kode(data);
        return this.formatKode(kode);
    }
}
