// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import SamsvarAnsvarsomraade from "../../data-classes/SamsvarAnsvarsomraade.js";

/**
 * Initializes a new instance of the CustomGroupAnsvarsrettErklaeringer class.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.resourceValues - Resource values for the component, including title.
 *
 * @property {boolean} isEmpty - Indicates if the data is empty.
 * @property {Array} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource bindings used in the component.
 * @property {Object} resourceValues - Contains title and data for the component.
 */
export default class CustomGroupSamsvarErklaeringer extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            title: props?.resourceValues?.title,
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.erklaeringer?.emptyFieldText) : data,
            simpleBinding: props?.formData?.simpleBinding
        };
    }

    /**
     * Retrieves a list of "ansvarsomraade" values from the form data.
     *
     * @param {Object} props - The properties object containing form data and component information.
     * @param {Object} resourceBindings - The resource bindings used to extract specific data.
     * @returns {Array} The list of "ansvarsomraade" values extracted from the form data.
     */
    getValueFromFormData(props, resourceBindings) {
        const { simpleBinding, ...formDataWithoutSimpleBinding } = props.formData ?? {};
        const cleanedProps = {
            ...props,
            formData: formDataWithoutSimpleBinding
        };
        const data = getComponentDataValue(cleanedProps);
        const ansvarsomraadeList = this.getAnsvarsomraadeListFromData(data, resourceBindings);
        return ansvarsomraadeList;
    }

    /**
     * Converts input data into a list of AnsvarsrettAnsvarsomraade instances.
     *
     * @param {*} data - The input data, expected to be an array of ansvarsomraade objects.
     * @param {*} resourceBindings - Resource bindings to be passed to each SamsvarAnsvarsomraade instance.
     * @returns {SamsvarAnsvarsomraade[]|undefined} An array of SamsvarAnsvarsomraade instances if data is valid, otherwise undefined.
     */
    getAnsvarsomraadeListFromData(data, resourceBindings) {
        if (!hasValue(data)) {
            return undefined;
        }
        return Array.isArray(data) ? data.map((ansvarsomraade) => new SamsvarAnsvarsomraade(ansvarsomraade, resourceBindings)) : [];
    }

    /**
     * Retrieves validation messages based on the provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing text resource bindings to be validated.
     * @returns {Array|string|boolean} The result of the validation, as returned by hasMissingTextResources.
     */
    getValidationMessages(textResourceBindings) {
        return hasMissingTextResources(textResourceBindings);
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
     * Generates an object containing resource bindings for various text fields,
     * providing default values if not specified in the props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource binding overrides for text fields.
     * @param {Object} [props.resourceBindings.samsvarErklaeringTekst] - Overrides for 'samsvarErklaeringTekst'.
     * @param {Object} [props.resourceBindings.samsvarPROTekst] - Overrides for 'samsvarPROTekst'.
     * @param {Object} [props.resourceBindings.samsvarUTFTekst] - Overrides for 'samsvarUTFTekst'.
     * @param {string} [props.resourceBindings.title] - Title override for 'erklaeringer'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Empty field text override for 'erklaeringer'.
     * @param {Object} [props.resourceValues] - Resource values, used to check for title presence.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'erklaeringer'.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'erklaeringer'.
     * @returns {Object} Resource bindings object with localized text and titles for each field.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            samsvarErklaeringTekst: {
                title: props?.resourceBindings?.samsvarErklaeringTekst?.title || "resource.samsvarErklaeringTekst.title",
                emptyFieldText: props?.resourceBindings?.samsvarErklaeringTekst?.emptyFieldText || "resource.emptyFieldText.default"
            },
            samsvarPROTekst: {
                title: props?.resourceBindings?.samsvarPROTekst?.title || "resource.samsvarPROTekst.title",
                emptyFieldText: props?.resourceBindings?.samsvarPROTekst?.emptyFieldText || "resource.emptyFieldText.default"
            },
            samsvarUTFTekst: {
                title: props?.resourceBindings?.samsvarUTFTekst?.title || "resource.samsvarUTFTekst.title",
                emptyFieldText: props?.resourceBindings?.samsvarUTFTekst?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.erklaeringer = {
                title: props?.resourceBindings?.title || "resource.erklaeringer.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.erklaeringer = {
                ...resourceBindings.erklaeringer,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
