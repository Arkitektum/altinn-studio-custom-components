// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupVegtypeTillatelse is a custom component class for handling group data related to "vegtype tillatelse" (road type permission).
 *
 * This class extends CustomComponent and provides logic for:
 * - Extracting and validating form data.
 * - Managing resource bindings for text resources.
 * - Handling empty state and validation messages.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} [props.resourceBindings] - Optional resource binding overrides for text resources.
 * @param {Object} [props.resourceBindings.vegtype] - Optional overrides for vegtype resource bindings.
 * @param {string} [props.resourceBindings.vegtype.title] - Custom title resource key for vegtype.
 * @param {Object} [props.resourceBindings.erTillatelseGitt] - Optional overrides for erTillatelseGitt resource bindings.
 * @param {string} [props.resourceBindings.erTillatelseGitt.title] - Custom title resource key for erTillatelseGitt.
 * @param {string} [props.resourceBindings.erTillatelseGitt.trueText] - Custom trueText resource key.
 * @param {string} [props.resourceBindings.erTillatelseGitt.falseText] - Custom falseText resource key.
 * @param {string} [props.resourceBindings.erTillatelseGitt.defaultText] - Custom defaultText resource key.
 * @param {string|boolean} [props.hideIfEmpty] - If true, omits the vegtypeTillatelse resource binding.
 * @param {string} [props.resourceBindings.emptyFieldText] - Custom emptyFieldText resource key for vegtypeTillatelse.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for text resources.
 * @property {Object} resourceValues - Values for resources, including data or empty field text.
 */
export default class CustomGroupVegtypeTillatelse extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.vegtypeTillatelse?.emptyFieldText) : data
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
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Retrieves the value associated with the component from the provided form data props.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return data;
    }

    /**
     * Generates resource binding objects for component properties, providing default resource keys if not specified in props.
     *
     * @param {Object} props - The properties object containing optional resourceBindings and hideIfEmpty flag.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides.
     * @param {Object} [props.resourceBindings.vegtype] - Optional overrides for vegtype resource bindings.
     * @param {string} [props.resourceBindings.vegtype.title] - Custom title resource key for vegtype.
     * @param {Object} [props.resourceBindings.erTillatelseGitt] - Optional overrides for erTillatelseGitt resource bindings.
     * @param {string} [props.resourceBindings.erTillatelseGitt.title] - Custom title resource key for erTillatelseGitt.
     * @param {string} [props.resourceBindings.erTillatelseGitt.trueText] - Custom trueText resource key.
     * @param {string} [props.resourceBindings.erTillatelseGitt.falseText] - Custom falseText resource key.
     * @param {string} [props.resourceBindings.erTillatelseGitt.defaultText] - Custom defaultText resource key.
     * @param {string|boolean} [props.hideIfEmpty] - If true, omits the vegtypeTillatelse resource binding.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom emptyFieldText resource key for vegtypeTillatelse.
     * @returns {Object} Resource bindings object with default or overridden resource keys.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            vegtype: {
                title: props?.resourceBindings?.vegtype?.title || `resource.rammebetingelser.adkomst.vegtype.title`
            },
            erTillatelseGitt: {
                title: props?.resourceBindings?.erTillatelseGitt?.title || "resource.rammebetingelser.adkomst.erTillatelseGitt.title",
                trueText: props?.resourceBindings?.erTillatelseGitt?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.erTillatelseGitt?.falseText || "resource.falseText.default",
                defaultText: props?.resourceBindings?.erTillatelseGitt?.defaultText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.vegtypeTillatelse = {
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
