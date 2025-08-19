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
        this.resourceBindings = resourceBindings?.ettersending || {};
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
     * Generates resource binding keys for the Ettersending component.
     *
     * @param {Object} props - The properties object.
     * @param {boolean|string} [props.hideIfEmpty] - Determines if the empty field text should be hidden.
     * @param {Object} [props.resourceBindings] - Optional custom resource bindings.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom text for empty fields.
     * @returns {Object} An object containing resource binding keys for the Ettersending component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            "tema.kodebeskrivelse.title": "resource.ettersendinger.ettersending.tema.kodebeskrivelse.title",
            "kommentar.title": "resource.ettersendinger.ettersending.kommentar.title",
            "vedleggsliste.vedlegg.title": "resource.ettersendinger.ettersending.vedleggsliste.vedlegg.title"
        };
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.emptyFieldText = props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default";
        }
        return {
            ettersending: resourceBindings
        };
    }
}
