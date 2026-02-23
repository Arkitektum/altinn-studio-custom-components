// Classes
import CustomComponent from "../CustomComponent.js";
import VegtypeTillatelseList from "../data-classes/VegtypeTillatelseList.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGrouplistVegtypeTillatelse is a specialized component class for handling grouped lists of "vegtype tillatelse" (road type permissions).
 * It extends CustomComponent and manages resource bindings, validation messages, and content state based on form data.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties object containing form data and resource bindings.
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Array|string} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource binding keys for component properties.
 * @property {Object} resourceValues - Values derived from resource bindings and form data.
 */
export default class CustomGrouplistVegtypeTillatelse extends CustomComponent {
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
            vegtype: resourceBindings?.vegtype,
            erTillatelseGitt: resourceBindings?.erTillatelseGitt
        };
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.vegtypeTillatelse?.emptyFieldText) : data
        };
    }

    /**
     * Determines if the provided data contains any content.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string} - The validation messages indicating missing text resources.
     */
    getValidationMessages(resourceBindings) {
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Extracts and returns the `data` property from the `resourceValues` of a `VegtypeTillatelseList`
     * instance, which is initialized with the component's form data.
     *
     * @param {Object} props - The properties object containing form data for the component.
     * @returns {*} The `data` property from the `resourceValues` of the `VegtypeTillatelseList`, or `undefined` if not available.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const vegTypeTillatelseList = new VegtypeTillatelseList(data);
        return vegTypeTillatelseList?.resourceValues?.data;
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
