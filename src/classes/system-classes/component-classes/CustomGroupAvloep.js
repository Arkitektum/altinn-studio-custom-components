// Classes
import CustomComponent from "../CustomComponent.js";
import Avloep from "../../data-classes/Avloep.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupAvloep is a specialized component class for handling Avloep-related form data and resource bindings.
 * It extends CustomComponent and provides logic for extracting, validating, and presenting Avloep data.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for initializing the component.
 * @param {Object} [props.resourceBindings] - Custom resource binding values for fields.
 * @param {Object} [props.resourceValues] - Custom resource values for fields.
 *
 * @property {boolean} isEmpty - Indicates if the Avloep data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for component fields.
 * @property {Object} resourceValues - Resource values for title and data.
 *
 * @method hasContent Checks if the provided data has a value.
 * @method getValidationMessages Retrieves validation messages based on provided resource bindings.
 * @method getValueFromFormData Retrieves the value from form data and returns an instance of Avloep.
 * @method getResourceBindings Generates resource binding objects for various component fields based on provided props.
 */
export default class CustomGroupAvloep extends CustomComponent {
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
            title: hasValue(props?.resourceValues?.title)
                ? props?.resourceValues?.title
                : getTextResourceFromResourceBinding(resourceBindings?.avloep?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.avloep?.emptyFieldText) : data
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
     * Retrieves the value from form data and returns an instance of Avloep.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Avloep} An instance of Avloep initialized with the component data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const avloep = new Avloep(data);
        return avloep;
    }

    /**
     * Generates resource binding objects for various component fields based on provided props.
     *
     * @param {Object} props - The properties object containing resource bindings and display options.
     * @param {Object} [props.resourceBindings] - Custom resource binding values for fields.
     * @param {Object} [props.resourceBindings.harTinglystErklaering] - Resource bindings for 'harTinglystErklaering'.
     * @param {string} [props.resourceBindings.harTinglystErklaering.title] - Custom title for 'harTinglystErklaering'.
     * @param {string} [props.resourceBindings.harTinglystErklaering.trueText] - Custom true text for 'harTinglystErklaering'.
     * @param {string} [props.resourceBindings.harTinglystErklaering.falseText] - Custom false text for 'harTinglystErklaering'.
     * @param {Object} [props.resourceBindings.krysserAvloepAnnensGrunn] - Resource bindings for 'krysserAvloepAnnensGrunn'.
     * @param {string} [props.resourceBindings.krysserAvloepAnnensGrunn.title] - Custom title for 'krysserAvloepAnnensGrunn'.
     * @param {string} [props.resourceBindings.krysserAvloepAnnensGrunn.trueText] - Custom true text for 'krysserAvloepAnnensGrunn'.
     * @param {string} [props.resourceBindings.krysserAvloepAnnensGrunn.falseText] - Custom false text for 'krysserAvloepAnnensGrunn'.
     * @param {Object} [props.resourceBindings.tilknytningstype] - Resource bindings for 'tilknytningstype'.
     * @param {string} [props.resourceBindings.tilknytningstype.title] - Custom title for 'tilknytningstype'.
     * @param {string} [props.resourceBindings.title] - Custom title for 'avloep'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom text for empty fields.
     * @param {boolean|string} [props.hideTitle] - If true, hides the 'avloep' title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the 'avloep' field if empty.
     * @returns {Object} Resource bindings object for use in the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            harTinglystErklaering: {
                title: props?.resourceBindings?.harTinglystErklaering?.title || `resource.rammebetingelser.avloep.harTinglystErklaering.title`,
                trueText: props?.resourceBindings?.harTinglystErklaering?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.harTinglystErklaering?.falseText || `resource.falseText.default`
            },
            krysserAvloepAnnensGrunn: {
                title: props?.resourceBindings?.krysserAvloepAnnensGrunn?.title || `resource.rammebetingelser.avloep.krysserAvloepAnnensGrunn.title`,
                trueText: props?.resourceBindings?.krysserAvloepAnnensGrunn?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.krysserAvloepAnnensGrunn?.falseText || `resource.falseText.default`
            },
            tilknytningstype: {
                title: props?.resourceBindings?.tilknytningstype?.title || `resource.rammebetingelser.avloep.tilknytningstype.title`
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.avloep = {
                title: props?.resourceBindings?.title || "resource.rammebetingelser.avloep.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.avloep = {
                ...resourceBindings.avloep,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
