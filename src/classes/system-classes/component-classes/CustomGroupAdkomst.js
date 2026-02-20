// Classes
import CustomComponent from "../CustomComponent.js";
import Adkomst from "../../data-classes/Adkomst.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupAdkomst is a specialized component class for handling "adkomst" (access) data and resource bindings.
 * It extends CustomComponent and provides logic for managing form data, resource bindings, and validation messages.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @param {Object} [props.resourceBindings] - Optional resource bindings for customizing text resources.
 * @param {Object} [props.resourceValues] - Optional resource values for overriding default text resources.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for text resources.
 * @property {Object} resourceValues - Values for text resources, including title and data.
 *
 * @method hasContent Checks if the provided data has a value.
 * @method getValidationMessages Retrieves validation messages based on provided resource bindings.
 * @method getValueFromFormData Retrieves the value from form data and returns an instance of Adkomst.
 * @method getResourceBindings Generates resource bindings for component properties, providing default resource keys if not specified.
 */
export default class CustomGroupAdkomst extends CustomComponent {
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
                : getTextResourceFromResourceBinding(resourceBindings?.adkomst?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.adkomst?.emptyFieldText) : data
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
     * Retrieves the value from form data and returns an instance of Avloep.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Adkomst} An instance of Adkomst initialized with the component data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const adkomst = new Adkomst(data);
        return adkomst;
    }

    /**
     * Generates resource bindings for component properties, providing default resource keys if not specified.
     *
     * @param {Object} props - The properties object containing resource bindings and display options.
     * @param {Object} [props.resourceBindings] - Custom resource binding overrides.
     * @param {Object} [props.resourceBindings.erNyEllerEndretAdkomst] - Resource bindings for 'erNyEllerEndretAdkomst'.
     * @param {string} [props.resourceBindings.erNyEllerEndretAdkomst.title] - Custom title for 'erNyEllerEndretAdkomst'.
     * @param {string} [props.resourceBindings.erNyEllerEndretAdkomst.trueText] - Custom true text.
     * @param {string} [props.resourceBindings.erNyEllerEndretAdkomst.falseText] - Custom false text.
     * @param {Object} [props.resourceBindings.vegtype] - Resource bindings for 'vegtype'.
     * @param {string} [props.resourceBindings.vegtype.title] - Custom title for 'vegtype'.
     * @param {Object} [props.resourceBindings.erTillatelseGitt] - Resource bindings for 'erTillatelseGitt'.
     * @param {string} [props.resourceBindings.erTillatelseGitt.title] - Custom title for 'erTillatelseGitt'.
     * @param {string} [props.resourceBindings.erTillatelseGitt.trueText] - Custom true text for 'erTillatelseGitt'.
     * @param {string} [props.resourceBindings.erTillatelseGitt.falseText] - Custom false text for 'erTillatelseGitt'.
     * @param {string} [props.resourceBindings.erTillatelseGitt.defaultText] - Custom default text for 'erTillatelseGitt'.
     * @param {string} [props.resourceBindings.title] - Custom title for 'adkomst'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text for 'adkomst'.
     * @param {boolean|string} [props.hideTitle] - If true, hides the 'adkomst' title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the 'adkomst' empty field text.
     * @returns {Object} Resource bindings object with default and overridden values.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            erNyEllerEndretAdkomst: {
                title: props?.resourceBindings?.erNyEllerEndretAdkomst?.title || `resource.rammebetingelser.adkomst.erNyEllerEndretAdkomst.title`,
                trueText: props?.resourceBindings?.erNyEllerEndretAdkomst?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.erNyEllerEndretAdkomst?.falseText || `resource.falseText.default`
            },
            vegtype: {
                title: props?.resourceBindings?.vegtype?.title || `resource.rammebetingelser.adkomst.vegtype.title`
            },
            erTillatelseGitt: {
                title: props?.resourceBindings?.erTillatelseGitt?.title || "resource.rammebetingelser.adkomst.erTillatelseGitt.title",
                trueText: props?.resourceBindings?.erTillatelseGitt?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.erTillatelseGitt?.falseText || "resource.falseText.default",
                defaultText: props?.resourceBindings?.erTillatelseGitt?.defaultText || "resource.defaultText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.adkomst = {
                title: props?.resourceBindings?.title || "resource.rammebetingelser.adkomst.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.adkomst = {
                ...resourceBindings.adkomst,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
