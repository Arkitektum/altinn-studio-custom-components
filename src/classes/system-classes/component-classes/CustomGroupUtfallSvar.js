// Classes
import CustomComponent from "../CustomComponent.js";
import UtfallSvar from "../../data-classes/UtfallSvar.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
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
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings?.utfallSvar || {};
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.utfallSvar?.emptyFieldText) : data
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
     * Retrieves the value from form data, constructs an UtfallSvar instance with it, and returns the instance.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {UtfallSvar} An instance of UtfallSvar initialized with the component's data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const utfallSvar = new UtfallSvar(data);
        return utfallSvar;
    }

    /**
     * Generates resource bindings for the component based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {boolean|string} [props.hideIfEmpty] - Determines if the empty field text should be hidden.
     * @param {Object} [props.resourceBindings] - Optional custom resource bindings.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom text for empty fields.
     * @returns {Object} An object containing resource bindings for `utfallSvar`.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            "status.title": "resource.utfallBesvarelse.utfallSvar.status.title",
            "tema.kodebeskrivelse.title": "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title",
            "kommentar.title": "resource.utfallBesvarelse.utfallSvar.kommentar.title",
            "vedleggsliste.vedlegg.title": "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
        };
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.emptyFieldText = props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default";
        }
        return {
            utfallSvar: resourceBindings
        };
    }
}
