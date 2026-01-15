// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupUtfallSvarType is a custom component class that handles the logic for displaying
 * and validating a group outcome answer type within a form. It extends the CustomComponent base class
 * and manages resource bindings, validation messages, and resource values for rendering.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component, including form data and resource values.
 *
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component, if any.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages present.
 * @property {Object} resourceValues - Contains resource values for rendering, such as title and data.
 */
export default class CustomGroupUtfallSvarType extends CustomComponent {
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
            title: resourceBindings?.utfallSvarType?.title,
            kommentar: resourceBindings?.kommentar,
            tema: resourceBindings?.tema,
            utfallSvarStatus: resourceBindings?.utfallSvarStatus,
            vedleggsliste: resourceBindings?.vedleggsliste
        };
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
     * @param {Object} resourceBindings - An object containing resource binding keys.
     * @returns {Array|string|boolean} The result of checking for missing text resources, which could be an array of messages, a string, or a boolean depending on implementation.
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
     * Generates resource binding objects for various fields based on provided props.
     * If a specific resource binding title is not provided in props, a default resource key is constructed using the utfallType.
     *
     * @param {Object} props - The properties object containing resource values and bindings.
     * @param {Object} [props.resourceValues] - Contains values such as utfallType.
     * @param {string} [props.resourceValues.utfallType] - The type of outcome used to construct resource keys.
     * @param {Object} [props.resourceBindings] - Optional custom resource bindings for each field.
     * @param {Object} [props.resourceBindings.utfallSvarType] - Custom binding for utfallSvarType.
     * @param {Object} [props.resourceBindings.kommentar] - Custom binding for kommentar.
     * @param {Object} [props.resourceBindings.tema] - Custom binding for tema.
     * @param {Object} [props.resourceBindings.utfallSvarStatus] - Custom binding for utfallSvarStatus.
     * @param {Object} [props.resourceBindings.vedleggsliste] - Custom binding for vedleggsliste.
     * @returns {Object} An object containing resource bindings for utfallSvarType, kommentar, tema, utfallSvarStatus, and vedleggsliste.
     */
    getResourceBindings(props) {
        const utfallType = props?.resourceValues?.utfallType;
        return {
            utfallSvarType: {
                title: props?.resourceBindings?.title || `resource.utfallBesvarelse.utfallSvar.${utfallType?.toLowerCase()}.header`
            },
            kommentar: {
                title: props?.resourceBindings?.kommentar?.title || `resource.utfallBesvarelse.utfallSvar.kommentar.title`
            },
            tema: {
                title: props?.resourceBindings?.tema?.title || `resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title`
            },
            utfallSvarStatus: {
                title: props?.resourceBindings?.utfallSvarStatus?.title || `resource.utfallBesvarelse.utfallSvar.status.title`
            },
            vedleggsliste: {
                title: props?.resourceBindings?.vedleggsliste?.title || `resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title`
            }
        };
    }
}
