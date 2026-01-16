// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGrouplistUtfallSvar is a custom component class for handling group list responses with resource bindings and validation.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @param {Object} props.resourceBindings - Resource bindings for the component.
 * @param {string} [props.resourceBindings.title] - Title resource binding.
 * @param {string} [props.resourceBindings.emptyFieldText] - Empty field text resource binding.
 * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title.
 * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceValues - Contains resolved text resources for title and data.
 * @property {string} resourceValues.title - The resolved title text resource.
 * @property {*} resourceValues.data - The resolved data or empty field text resource.
 */

export default class CustomGrouplistUtfallSvar extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = {
            utfallSvarStatus: resourceBindings?.utfallSvarStatus,
            tema: resourceBindings?.tema,
            kommentar: resourceBindings?.kommentar,
            vedleggsliste: resourceBindings?.vedleggsliste
        };
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.utfallSvar?.title),
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
     * @param {Object} resourceBindings - An object containing resource binding keys for validation.
     * @returns {Array|string|boolean} The result of the validation, typically an array of missing text resources,
     *                                 a string message, or a boolean indicating validation status.
     */
    getValidationMessages(resourceBindings) {
        return hasMissingTextResources(resourceBindings);
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
     * Generates resource bindings for the component based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource bindings for the component.
     * @param {string} [props.resourceBindings.title] - Title resource binding.
     * @param {string} [props.resourceBindings.emptyFieldText] - Empty field text resource binding.
     * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text.
     * @returns {Object} An object containing the resource bindings for 'utfallSvar'.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            utfallSvarStatus: {
                title: props?.resourceBindings?.status?.title || "resource.utfallBesvarelse.utfallSvar.status.title",
                status: props?.resourceBindings?.status?.status || "resource.utfallBesvarelse.utfallSvar.status",
                erUtfallBesvaresSenere:
                    props?.resourceBindings?.erUtfallBesvaresSenere || "resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere",
                erUtfallBesvart: props?.resourceBindings?.erUtfallBesvart || "resource.utfallBesvarelse.utfallSvar.erUtfallBesvart"
            },
            tema: {
                title: props?.resourceBindings?.tema?.kodebeskrivelse?.title || "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title"
            },
            kommentar: {
                title: props?.resourceBindings?.kommentar?.title || "resource.utfallBesvarelse.utfallSvar.kommentar.title"
            },
            vedleggsliste: {
                title: props?.resourceBindings?.vedleggsliste?.vedlegg?.title || "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.utfallSvar = {
                title: props?.resourceBindings?.title || "resource.utfallBesvarelse.utfallSvar.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.utfallSvar = {
                ...resourceBindings.utfallSvar,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
