// Classes
import CustomComponent from "../CustomComponent.js";
import UtfallSvar from "../../data-classes/UtfallSvar.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
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
        this.resourceBindings = resourceBindings;
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
        return hasMissingTextResources(resourceBindings);
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
     * Generates a resource bindings object for various component fields, providing default resource keys
     * if specific bindings are not supplied in the props. Handles nested resource binding structures
     * for fields such as utfallSvarStatus, tema, kommentar, and vedleggsliste.
     *
     * @param {Object} props - The properties object containing optional resourceBindings and configuration flags.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for various fields.
     * @param {Object} [props.resourceBindings.status] - Optional overrides for utfallSvarStatus.
     * @param {string} [props.resourceBindings.status.title] - Custom resource key for status title.
     * @param {string} [props.resourceBindings.status.status] - Custom resource key for status.
     * @param {string} [props.resourceBindings.erUtfallBesvaresSenere] - Custom resource key for erUtfallBesvaresSenere.
     * @param {string} [props.resourceBindings.erUtfallBesvart] - Custom resource key for erUtfallBesvart.
     * @param {Object} [props.resourceBindings.tema] - Optional overrides for tema.
     * @param {Object} [props.resourceBindings.tema.kodebeskrivelse] - Optional overrides for tema kodebeskrivelse.
     * @param {string} [props.resourceBindings.tema.kodebeskrivelse.title] - Custom resource key for tema title.
     * @param {Object} [props.resourceBindings.kommentar] - Optional overrides for kommentar.
     * @param {string} [props.resourceBindings.kommentar.title] - Custom resource key for kommentar title.
     * @param {Object} [props.resourceBindings.vedleggsliste] - Optional overrides for vedleggsliste.
     * @param {Object} [props.resourceBindings.vedleggsliste.vedlegg] - Optional overrides for vedlegg.
     * @param {string} [props.resourceBindings.vedleggsliste.vedlegg.title] - Custom resource key for vedlegg title.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom resource key for empty field text.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the emptyFieldText binding from utfallSvar.
     * @returns {Object} The resource bindings object with resolved resource keys for each field.
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
            },
            utfallSvar: {}
        };
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.utfallSvar = {
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
