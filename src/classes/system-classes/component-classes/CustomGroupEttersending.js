// Classes
import CustomComponent from "../CustomComponent.js";
import Ettersending from "../../data-classes/Ettersending.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupEttersending is a custom component class for handling Ettersending group logic.
 * It initializes resource bindings, validation messages, and manages empty state and resource values.
 *
 * @extends CustomComponent
 */
export default class CustomGroupEttersending extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings || {};
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ettersending?.emptyFieldText) : data
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
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string|boolean} - The result of checking for missing text resources, which may be an array of messages, a string, or a boolean depending on implementation.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Retrieves the value from form data and returns an instance of Ettersending.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Ettersending} An instance of Ettersending initialized with the component data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const ettersending = new Ettersending(data);
        return ettersending;
    }

    /**
     * Generates resource bindings for a custom group ettersending component.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource bindings for the component.
     * @param {Object} [props.resourceBindings.tema] - Resource bindings for 'tema'.
     * @param {Object} [props.resourceBindings.tema.kodebeskrivelse] - Resource bindings for 'kodebeskrivelse' under 'tema'.
     * @param {string} [props.resourceBindings.tema.kodebeskrivelse.title] - Title for 'tema.kodebeskrivelse'.
     * @param {Object} [props.resourceBindings.kommentar] - Resource bindings for 'kommentar'.
     * @param {string} [props.resourceBindings.kommentar.title] - Title for 'kommentar'.
     * @param {Object} [props.resourceBindings.vedleggsliste] - Resource bindings for 'vedleggsliste'.
     * @param {Object} [props.resourceBindings.vedleggsliste.vedlegg] - Resource bindings for 'vedlegg' under 'vedleggsliste'.
     * @param {string} [props.resourceBindings.vedleggsliste.vedlegg.title] - Title for 'vedleggsliste.vedlegg'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display for empty fields.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits 'emptyFieldText' from resource bindings.
     * @returns {Object} Resource bindings object for the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            tema: {
                title: props?.resourceBindings?.tema?.kodebeskrivelse?.title || "resource.ettersendinger.ettersending.tema.kodebeskrivelse.title"
            },
            kommentar: {
                title: props?.resourceBindings?.kommentar?.title || "resource.ettersendinger.ettersending.kommentar.title"
            },
            vedleggsliste: {
                title: props?.resourceBindings?.vedleggsliste?.vedlegg?.title || "resource.ettersendinger.ettersending.vedleggsliste.vedlegg.title"
            },
            ettersending: {}
        };
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.ettersending = {
                ...resourceBindings.ettersending,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
