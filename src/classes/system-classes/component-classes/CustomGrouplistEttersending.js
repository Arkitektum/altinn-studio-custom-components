// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGrouplistEttersending is a custom component class for handling group list ettersending logic.
 * It manages resource bindings, validation messages, and content state for the component.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component.
 * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
 * @param {string} [props.resourceBindings.title] - Custom title resource binding.
 * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text resource binding.
 * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title resource binding.
 * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text resource binding.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceValues - Contains resource values for the component.
 */

export default class CustomGrouplistEttersending extends CustomComponent {
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
            tema: resourceBindings?.tema,
            kommentar: resourceBindings?.kommentar,
            vedleggsliste: resourceBindings?.vedleggsliste
        };
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.ettersendinger?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ettersendinger?.emptyFieldText) : data
        };
    }

    /**
     * Determines if the provided data contains any content.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string} - The validation messages indicating missing text resources.
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
     * Generates resource bindings for various components based on the provided props.
     *
     * @param {Object} props - The properties object containing resource bindings and configuration flags.
     * @param {Object} [props.resourceBindings] - Resource binding values for different components.
     * @param {Object} [props.resourceBindings.tema] - Resource bindings for 'tema'.
     * @param {Object} [props.resourceBindings.tema.kodebeskrivelse] - Resource bindings for 'tema.kodebeskrivelse'.
     * @param {string} [props.resourceBindings.tema.kodebeskrivelse.title] - Title for 'tema.kodebeskrivelse'.
     * @param {Object} [props.resourceBindings.kommentar] - Resource bindings for 'kommentar'.
     * @param {string} [props.resourceBindings.kommentar.title] - Title for 'kommentar'.
     * @param {Object} [props.resourceBindings.vedleggsliste] - Resource bindings for 'vedleggsliste'.
     * @param {Object} [props.resourceBindings.vedleggsliste.vedlegg] - Resource bindings for 'vedleggsliste.vedlegg'.
     * @param {string} [props.resourceBindings.vedleggsliste.vedlegg.title] - Title for 'vedleggsliste.vedlegg'.
     * @param {string} [props.resourceBindings.title] - Title for 'ettersendinger'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when a field is empty.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'ettersendinger'.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'ettersendinger'.
     * @returns {Object} Resource bindings object for the components.
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
            ettersendinger: {}
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.ettersendinger = {
                title: props?.resourceBindings?.title || "resource.ettersendinger.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.ettersendinger = {
                ...resourceBindings.ettersendinger,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
