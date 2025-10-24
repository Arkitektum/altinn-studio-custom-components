// Classes
import CustomComponent from "../CustomComponent.js";
import UtfallSvarStatus from "../../data-classes/UtfallSvarStatus.js";

// Global functions
import {
    getComponentDataValue,
    getComponentResourceValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    getTextResourcesFromResourceBindings,
    hasValue,
    validateTexts
} from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomFieldUtfallSvarStatus is a custom component class for handling the display and validation
 * of "utfall svar status" (outcome answer status) in a form. It manages resource bindings,
 * retrieves and formats status text, and handles validation messages.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} [props.resourceBindings] - Optional resource bindings for localization.
 * @param {string} [props.resourceBindings.title] - Optional override for the title resource key.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceValues - Contains localized title and data for the component.
 *
 */
export default class CustomFieldUtfallSvarStatus extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings?.utfallSvarStatus);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.utfallSvarStatus?.title),
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
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string|boolean} The result of the missing text resources check, which may be an array of messages, a string, or a boolean depending on implementation.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Returns the appropriate status text based on the provided utfallSvarStatus object.
     * It prioritizes text resources from resourceBindings, falling back to default texts if necessary.
     *
     * @param {Object} utfallSvarStatus - The status object indicating the current state.
     * @param {boolean} [utfallSvarStatus.erUtfallBesvaresSenere] - Indicates if the outcome will be answered later.
     * @param {boolean} [utfallSvarStatus.erUtfallBesvart] - Indicates if the outcome has already been answered.
     * @param {Object} resourceBindings - The resource bindings containing text resources.
     * @param {string} componentId - The ID of the component for validation context.
     * @returns {string} The status text corresponding to the current utfallSvarStatus.
     */
    getStatusText(utfallSvarStatus, resourceBindings, componentId) {
        const texts = getTextResourcesFromResourceBindings(resourceBindings);
        const textKeys = ["erUtfallBesvaresSenere", "erUtfallBesvart", "status"];
        const fallbackTexts = {
            erUtfallBesvaresSenere: "Besvares senere",
            erUtfallBesvart: "Svar innsendt tidligere",
            status: "Besvares nå"
        };
        validateTexts(texts, fallbackTexts, textKeys, componentId);
        if (utfallSvarStatus?.erUtfallBesvaresSenere) {
            return texts?.erUtfallBesvaresSenere !== undefined && texts?.erUtfallBesvaresSenere !== null
                ? texts.erUtfallBesvaresSenere
                : fallbackTexts.erUtfallBesvaresSenere;
        } else if (utfallSvarStatus?.erUtfallBesvart) {
            return texts?.erUtfallBesvart !== undefined && texts?.erUtfallBesvart !== null ? texts.erUtfallBesvart : fallbackTexts.erUtfallBesvart;
        } else {
            return texts?.status ? texts.status : fallbackTexts.status;
        }
    }

    /**
     * Retrieves the status text for a component based on form data and resource bindings.
     *
     * @param {Object} props - The properties of the component, including form data and optional id.
     * @param {Object} resourceBindings - The resource bindings used for localization or status mapping.
     * @returns {string} The status text derived from the form data and resource bindings.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const utfallSvarStatus = new UtfallSvarStatus(data);
        return this.getStatusText(utfallSvarStatus, resourceBindings, props?.id);
    }

    /**
     * Retrieves the resource bindings for the component, providing default resource keys if not specified in props.
     *
     * @param {Object} props - The properties object that may contain resourceBindings.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {string} [props.resourceBindings.title] - Optional override for the title resource key.
     * @returns {Object} An object containing the `utfallSvarStatus` resource bindings.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            title: props?.resourceBindings?.title || "resource.utfallBesvarelse.utfallSvar.status.title",
            erUtfallBesvaresSenere: props?.resourceBindings?.erUtfallBesvaresSenere || "resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere",
            erUtfallBesvart: props?.resourceBindings?.erUtfallBesvart || "resource.utfallBesvarelse.utfallSvar.erUtfallBesvart",
            status: props?.resourceBindings?.status || "resource.utfallBesvarelse.utfallSvar.status"
        };
        return {
            utfallSvarStatus: resourceBindings
        };
    }
}
