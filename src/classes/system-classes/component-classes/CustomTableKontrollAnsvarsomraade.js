// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.js";

/**
 * CustomTableAnsvarsrettAnsvarsomraade is a custom component class for handling and displaying
 * a table of "ansvarsomraade" (areas of responsibility) data, including resource bindings,
 * validation messages, and resource values for UI rendering.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties object containing form data, resource bindings, and configuration flags.
 * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
 * @param {Object} [props.resourceValues] - Optional resource values, used to determine if the title should be included.
 * @param {boolean|string} [props.hideTitle] - If true, omits the 'ansvarsomraader' title from the resource bindings.
 * @param {boolean|string} [props.hideIfEmpty] - If true, omits the 'emptyFieldText' for 'ansvarsomraader'.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings object for various fields.
 * @property {Object} resourceValues - Resource values for UI rendering, including title and data.
 *
 */
export default class CustomTableKontrollAnsvarsomraade extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ansvarsomraader?.emptyFieldText) : data
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
        const data = getComponentDataValue(props);
        const ansvarsomraadeList = this.getAnsvarsomraadeListFromData(data, resourceBindings);
        return ansvarsomraadeList;
    }

    /**
     * Converts input data into a list of KontrollAnsvarsomraade instances.
     *
     * @param {*} data - The input data, expected to be an array of ansvarsomraade objects.
     * @param {*} resourceBindings - Resource bindings to be passed to each KontrollAnsvarsomraade instance.
     * @returns {KontrollAnsvarsomraade[]|undefined} An array of KontrollAnsvarsomraade instances if data is valid, otherwise undefined.
     */
    getAnsvarsomraadeListFromData(data, resourceBindings) {
        if (!hasValue(data)) {
            return undefined;
        }
        return Array.isArray(data) ? data.map((ansvarsomraade) => new KontrollAnsvarsomraade(ansvarsomraade, resourceBindings)) : [];
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
     * Generates an object containing resource binding configurations for various fields,
     * providing default resource keys if specific bindings are not supplied in the props.
     *
     * @param {Object} props - The properties object containing resource binding information.
     * @param {Object} [props.resourceBindings] - Resource binding overrides for each field.
     * @param {Object} [props.resourceBindings.funksjon] - Resource bindings for 'funksjon' field.
     * @param {string} [props.resourceBindings.funksjon.title] - Title resource key for 'funksjon'.
     * @param {string} [props.resourceBindings.funksjon.emptyFieldText] - Empty field text resource key for 'funksjon'.
     * @param {Object} [props.resourceBindings.beskrivelseAvAnsvarsomraadet] - Resource bindings for 'beskrivelseAvAnsvarsomraadet' field.
     * @param {string} [props.resourceBindings.beskrivelseAvAnsvarsomraadet.title] - Title resource key for 'beskrivelseAvAnsvarsomraadet'.
     * @param {string} [props.resourceBindings.beskrivelseAvAnsvarsomraadet.emptyFieldText] - Empty field text resource key for 'beskrivelseAvAnsvarsomraadet'.
     * @param {Object} [props.resourceBindings.datoAnsvarsrettErklaert] - Resource bindings for 'datoAnsvarsrettErklaert' field.
     * @param {string} [props.resourceBindings.datoAnsvarsrettErklaert.title] - Title resource key for 'datoAnsvarsrettErklaert'.
     * @param {string} [props.resourceBindings.datoAnsvarsrettErklaert.emptyFieldText] - Empty field text resource key for 'datoAnsvarsrettErklaert'.
     * @param {Object} [props.resourceBindings.erAnsvarsomraadetAvsluttet] - Resource bindings for 'erAnsvarsomraadetAvsluttet' field.
     * @param {string} [props.resourceBindings.erAnsvarsomraadetAvsluttet.title] - Title resource key for 'erAnsvarsomraadetAvsluttet'.
     * @param {Object} [props.resourceBindings.erAnsvarsomraadetAvsluttet.trueText] - Resource binding for true value.
     * @param {string} [props.resourceBindings.erAnsvarsomraadetAvsluttet.trueText.title] - Resource key for true value text.
     * @param {Object} [props.resourceBindings.erAnsvarsomraadetAvsluttet.falseText] - Resource binding for false value.
     * @param {string} [props.resourceBindings.erAnsvarsomraadetAvsluttet.falseText.title] - Resource key for false value text.
     * @param {string} [props.resourceBindings.erAnsvarsomraadetAvsluttet.defaultText] - Default text resource key.
     * @param {string} [props.resourceBindings.title] - Title resource key for 'ansvarsomraade'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Empty field text resource key for 'ansvarsomraade'.
     * @param {Object} [props.resourceValues] - Resource values for the component.
     * @param {string} [props.resourceValues.title] - Title value for the component.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'ansvarsomraade'.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'ansvarsomraade'.
     * @returns {Object} An object containing resource binding configurations for each field.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            funksjon: {
                title: props?.resourceBindings?.funksjon?.title || "resource.funksjon.title",
                emptyFieldText: props?.resourceBindings?.funksjon?.emptyFieldText || "resource.emptyFieldText.default"
            },
            beskrivelseAvAnsvarsomraadet: {
                title: props?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.title || "resource.beskrivelseAvAnsvarsomraadet.title",
                emptyFieldText: props?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.emptyFieldText || "resource.emptyFieldText.default"
            },
            datoAnsvarsrettErklaert: {
                title: props?.resourceBindings?.datoAnsvarsrettErklaert?.title || "resource.datoAnsvarsrettErklaert.title",
                emptyFieldText: props?.resourceBindings?.datoAnsvarsrettErklaert?.emptyFieldText || "resource.emptyFieldText.default"
            },
            erAnsvarsomraadetAvsluttet: {
                title: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.title || "resource.erAnsvarsomraadetAvsluttet.title",
                trueText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.trueText?.title || "resource.trueText.default",
                falseText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.falseText?.title || "resource.falseText.default",
                defaultText: props?.resourceBindings?.erAnsvarsomraadetAvsluttet?.defaultText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.ansvarsomraade = {
                title: props?.resourceBindings?.title || "resource.ansvarsomraade.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.ansvarsomraade = {
                ...resourceBindings.ansvarsomraade,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
