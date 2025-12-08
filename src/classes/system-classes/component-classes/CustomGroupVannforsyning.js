// Classes
import CustomComponent from "../CustomComponent.js";
import Vannforsyning from "../../data-classes/Vannforsyning.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupVannforsyning is a specialized component class for handling water supply group data.
 * It extends CustomComponent and provides logic for extracting, validating, and binding resources
 * related to vannforsyning (water supply) in a form context.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} [props.resourceBindings] - Optional custom resource bindings for vannforsyning fields.
 * @param {boolean|string} [props.hideTitle] - If true, omits the vannforsyning title from resource bindings.
 * @param {boolean|string} [props.hideIfEmpty] - If true, omits the vannforsyning empty field text from resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the vannforsyning data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for vannforsyning fields.
 * @property {Object} resourceValues - Resource values for vannforsyning fields, including empty field text.
 */
export default class CustomGroupVannforsyning extends CustomComponent {
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
                : getTextResourceFromResourceBinding(resourceBindings?.vannforsyning?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.vannforsyning?.emptyFieldText) : data
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
     * Retrieves the value from form data and returns a Vannforsyning instance.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Vannforsyning} An instance of Vannforsyning initialized with the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const vannforsyning = new Vannforsyning(data);
        return vannforsyning;
    }

    /**
     * Generates resource bindings for component properties, providing default resource keys if not specified.
     *
     * @param {Object} props - The properties object containing resource bindings and display options.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each field.
     * @param {boolean|string} [props.hideTitle] - If true, omits the vannforsyning title binding.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the vannforsyning empty field text binding.
     * @returns {Object} An object containing resource bindings for various fields, with defaults applied.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            beskrivelse: {
                title: props?.resourceBindings?.beskrivelse?.title || `resource.rammebetingelser.vannforsyning.beskrivelse.title`
            },
            harTinglystErklaering: {
                title: props?.resourceBindings?.harTinglystErklaering?.title || `resource.rammebetingelser.vannforsyning.harTinglystErklaering.title`,
                trueText: props?.resourceBindings?.harTinglystErklaering?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.harTinglystErklaering?.falseText || `resource.falseText.default`
            },
            krysserVannforsyningAnnensGrunn: {
                title:
                    props?.resourceBindings?.krysserVannforsyningAnnensGrunn?.title ||
                    `resource.rammebetingelser.vannforsyning.krysserVannforsyningAnnensGrunn.title`,
                trueText: props?.resourceBindings?.krysserVannforsyningAnnensGrunn?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.krysserVannforsyningAnnensGrunn?.falseText || `resource.falseText.default`
            },
            tilknytningstype: {
                title: props?.resourceBindings?.tilknytningstype?.title || `resource.rammebetingelser.vannforsyning.tilknytningstype.title`
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.vannforsyning = {
                title: props?.resourceBindings?.title || "resource.rammebetingelser.vannforsyning.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.vannforsyning = {
                ...resourceBindings.vannforsyning,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
