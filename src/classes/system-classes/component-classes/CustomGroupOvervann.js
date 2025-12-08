// Classes
import CustomComponent from "../CustomComponent.js";
import Overvann from "../../data-classes/Overvann.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupOvervann is a custom component class for handling "overvann" (stormwater) group data.
 * It extends CustomComponent and provides logic for extracting, validating, and binding resources
 * related to stormwater management fields.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for initializing the component.
 * @param {Object} [props.resourceBindings] - Custom resource bindings for the component.
 * @param {Object} [props.resourceValues] - Custom resource values for the component.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for text resources.
 * @property {Object} resourceValues - Resource values for display, including title and data.
 *
 * @method hasContent Checks if the provided data has a value.
 * @method getValidationMessages Retrieves validation messages based on provided resource bindings.
 * @method getValueFromFormData Retrieves and constructs an Overvann instance from the provided form data props.
 * @method getResourceBindings Generates resource bindings for component properties, providing default values if not specified.
 */
export default class CustomGroupOvervann extends CustomComponent {
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
                : getTextResourceFromResourceBinding(resourceBindings?.overvann?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.overvann?.emptyFieldText) : data
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
     * Retrieves and constructs an Overvann instance from the provided form data props.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Overvann} An instance of Overvann initialized with the extracted data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const overvann = new Overvann(data);
        return overvann;
    }

    /**
     * Generates resource bindings for component properties, providing default values if not specified.
     *
     * @param {Object} props - The properties object containing resource bindings and display options.
     * @param {Object} [props.resourceBindings] - Custom resource bindings for the component.
     * @param {Object} [props.resourceBindings.ledesOvervannTilTerreng] - Resource binding for "ledesOvervannTilTerreng".
     * @param {string} [props.resourceBindings.ledesOvervannTilTerreng.title] - Title for "ledesOvervannTilTerreng".
     * @param {string} [props.resourceBindings.ledesOvervannTilTerreng.trueText] - Text for true value.
     * @param {string} [props.resourceBindings.ledesOvervannTilTerreng.falseText] - Text for false value.
     * @param {Object} [props.resourceBindings.ledesOvervannTilAvloepssystem] - Resource binding for "ledesOvervannTilAvloepssystem".
     * @param {string} [props.resourceBindings.ledesOvervannTilAvloepssystem.title] - Title for "ledesOvervannTilAvloepssystem".
     * @param {string} [props.resourceBindings.ledesOvervannTilAvloepssystem.trueText] - Text for true value.
     * @param {string} [props.resourceBindings.ledesOvervannTilAvloepssystem.falseText] - Text for false value.
     * @param {string} [props.resourceBindings.title] - Title for "overvann".
     * @param {string} [props.resourceBindings.emptyFieldText] - Text for empty field.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the field if empty.
     * @returns {Object} Resource bindings object with appropriate titles and texts.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            ledesOvervannTilTerreng: {
                title: props?.resourceBindings?.ledesOvervannTilTerreng?.title || `resource.rammebetingelser.overvann.ledesOvervannTilTerreng.title`,
                trueText: props?.resourceBindings?.ledesOvervannTilTerreng?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.ledesOvervannTilTerreng?.falseText || `resource.falseText.default`
            },
            ledesOvervannTilAvloepssystem: {
                title:
                    props?.resourceBindings?.ledesOvervannTilAvloepssystem?.title ||
                    `resource.rammebetingelser.overvann.ledesOvervannTilAvloepssystem.title`,
                trueText: props?.resourceBindings?.ledesOvervannTilAvloepssystem?.trueText || `resource.trueText.default`,
                falseText: props?.resourceBindings?.ledesOvervannTilAvloepssystem?.falseText || `resource.falseText.default`
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.overvann = {
                title: props?.resourceBindings?.title || "resource.rammebetingelser.overvann.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.overvann = {
                ...resourceBindings.plan,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
