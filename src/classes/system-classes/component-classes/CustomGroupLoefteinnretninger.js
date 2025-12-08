// Classes
import CustomComponent from "../CustomComponent.js";
import Loefteinnretninger from "../../data-classes/Loefteinnretninger.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupLoefteinnretninger is a custom component class for handling lift-related groupings in forms.
 * It manages resource bindings, validation messages, and data extraction for Loefteinnretninger components.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} [props.resourceBindings] - Optional custom resource bindings for each component.
 * @param {Object} [props.resourceValues] - Optional resource values for the component.
 * @param {boolean|string} [props.hideTitle] - If true, omits the main title binding.
 * @param {boolean|string} [props.hideIfEmpty] - If true, omits the empty field text binding.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource binding configurations for lift components.
 * @property {Object} resourceValues - Resource values including title and data for the component.
 */
export default class CustomGroupLoefteinnretninger extends CustomComponent {
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
                : getTextResourceFromResourceBinding(resourceBindings?.loefteinnretninger?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.loefteinnretninger?.emptyFieldText) : data
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
     * Retrieves the value from form data and returns an instance of Loefteinnretninger.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Loefteinnretninger} An instance of Loefteinnretninger initialized with the component data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const avloep = new Loefteinnretninger(data);
        return avloep;
    }

    /**
     * Generates an object containing resource binding configurations for various lift-related components.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional custom resource bindings for each component.
     * @param {boolean|string} [props.hideTitle] - If true, omits the main title binding.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the empty field text binding.
     * @returns {Object} An object with resource binding configurations for lift components.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            planleggesHeis: {
                title: props?.resourceBindings?.planleggesHeis?.title || `resource.rammebetingelser.loefteinnretninger.planleggesHeis.title`
            },
            planleggesLoefteplattform: {
                title:
                    props?.resourceBindings?.planleggesLoefteplattform?.title ||
                    `resource.rammebetingelser.loefteinnretninger.planleggesLoefteplattform.title`
            },
            planleggesRulletrapp: {
                title:
                    props?.resourceBindings?.planleggesRulletrapp?.title || `resource.rammebetingelser.loefteinnretninger.planleggesRulletrapp.title`
            },
            planleggesTrappeheis: {
                title:
                    props?.resourceBindings?.planleggesTrappeheis?.title || `resource.rammebetingelser.loefteinnretninger.planleggesTrappeheis.title`
            },
            planlagteLoefteinnretninger: {
                title:
                    props?.resourceBindings?.planlagteLoefteinnretninger?.title ||
                    `resource.rammebetingelser.loefteinnretninger.planlagteLoefteinnretninger.title`,
                emptyFieldText: props?.resourceBindings?.planlagteLoefteinnretninger?.emptyFieldText || `resource.emptyFieldText.default`
            },
            planleggesLoefteinnretningIBygning: {
                title:
                    props?.resourceBindings?.planleggesLoefteinnretningIBygning?.title ||
                    `resource.rammebetingelser.loefteinnretninger.planleggesLoefteinnretningIBygning.title`,
                trueText: props?.resourceBindings?.planleggesLoefteinnretningIBygning?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.planleggesLoefteinnretningIBygning?.falseText || `resource.falseText.default`
            },
            erLoefteinnretningIBygning: {
                title:
                    props?.resourceBindings?.erLoefteinnretningIBygning?.title ||
                    `resource.rammebetingelser.loefteinnretninger.erLoefteinnretningIBygning.title`,
                trueText: props?.resourceBindings?.erLoefteinnretningIBygning?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.erLoefteinnretningIBygning?.falseText || `resource.falseText.default`
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.loefteinnretninger = {
                title: props?.resourceBindings?.title || "resource.rammebetingelser.loefteinnretninger.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.loefteinnretninger = {
                ...resourceBindings.loefteinnretninger,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
