// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupUtfallSvar is a custom component class for handling grouped "utfallSvar" (outcome answers).
 * It extends the CustomComponent base class and manages resource bindings, validation messages, and data extraction
 * for the "utfallSvar" group in a form.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties containing form data and component information.
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages for the component.
 * @property {Object} validationMessages - The validation messages for the component.
 * @property {Object} resourceBindings - The resource bindings for the "utfallSvar" group.
 * @property {Object} resourceValues - The resource values for the component, including empty field text or data.
 */
export default class CustomGroupUtfallSvar extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings();

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings?.utfallSvar || {};
        this.resourceValues = {
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
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
     * Retrieves validation messages based on the provided resource bindings.
     *
     * @param {Object} resourceBindings - An object containing resource binding keys to validate.
     * @returns {boolean} Returns true if there are missing text resources, otherwise false.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Retrieves the value for this component from the provided form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }

    /**
     * Returns an object containing resource bindings for various fields in the "utfallSvar" group.
     *
     * @returns {Object} An object with a single property `utfallSvar`, which maps field keys to their corresponding resource binding strings.
     */
    getResourceBindings() {
        const resourceBindings = {
            "status.title": "resource.utfallBesvarelse.utfallSvar.status.title",
            "tema.kodebeskrivelse.title": "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title",
            "kommentar.title": "resource.utfallBesvarelse.utfallSvar.kommentar.title",
            "vedleggsliste.vedlegg.title": "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
        };
        return {
            utfallSvar: resourceBindings
        };
    }
}
