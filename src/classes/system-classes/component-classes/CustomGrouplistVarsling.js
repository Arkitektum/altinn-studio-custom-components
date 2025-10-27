// Classes
import CustomComponent from "../CustomComponent.js";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import Varsling from "../../data-classes/Varsling.js";

/**
 * CustomGrouplistVarsling is a specialized component class for handling checklist requirements
 * and notifications within a custom group list context. It extends CustomComponent and provides
 * methods for extracting, validating, and formatting checklist data and related resources.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing form data, resource bindings, and configuration options.
 *
 * @property {boolean} isEmpty - Indicates whether the checklist data is empty.
 * @property {Array|string} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for checklist requirements.
 * @property {Object} resourceValues - Contains title and data text resources for display.
 */
export default class CustomGrouplistVarsling extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = {
            title: resourceBindings?.varsling?.title,
            emptyFieldText: resourceBindings?.varsling?.emptyFieldText,
            trueText: resourceBindings?.varsling?.trueText,
            falseText: resourceBindings?.varsling?.falseText,
            defaultText: resourceBindings?.varsling?.defaultText
        };
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.varsling?.emptyFieldText) : data
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
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Retrieves the checklist requirement items from the form data using the provided resource bindings.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @param {Object} resourceBindings - The resource bindings used to extract relevant data.
     * @returns {Array} An array of checklist requirement items extracted from the form data.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const varsling = new Varsling(data);
        const sjekklistekravItems = this.getSjekklistekravItems(varsling, resourceBindings);
        return sjekklistekravItems;
    }

    /**
     * Retrieves a list of checklist requirement items based on the provided data and resource bindings.
     *
     * This method checks for specific checklist requirements related to exemption from neighbor notification
     * and the presence of remarks, and adds them to the returned array if they exist.
     *
     * @param {Object} data - The data object containing relevant information for checklist evaluation.
     * @param {Object} resourceBindings - The resource bindings used to resolve checklist requirements.
     * @returns {Array|null} An array of checklist requirement items if any exist, otherwise `null`.
     */
    getSjekklistekravItems(data, resourceBindings) {
        const sjekklistekravItems = [];
        const sjekklistekravForFritattFraNabovarsling = this.getSjekklistekravForFritattFraNabovarsling(data, resourceBindings);
        const sjekklistekravForForeliggerMerknader = this.getSjekklistekravForForeliggerMerknader(data, resourceBindings);
        if (sjekklistekravForFritattFraNabovarsling) {
            sjekklistekravItems.push(sjekklistekravForFritattFraNabovarsling);
        }
        if (sjekklistekravForForeliggerMerknader) {
            sjekklistekravItems.push(sjekklistekravForForeliggerMerknader);
        }
        return sjekklistekravItems.length > 0 ? sjekklistekravItems : null;
    }

    /**
     * Retrieves a Sjekklistekrav object for the "fritatt fra nabovarsling" property if it exists in the provided props.
     *
     * @param {Object} props - The properties object containing potential 'fritattFraNabovarsling'.
     * @param {Object} resourceBindings - The resource bindings object, possibly containing text resources for 'fritattFraNabovarsling'.
     * @returns {Sjekklistekrav|undefined} Returns a Sjekklistekrav instance if 'fritattFraNabovarsling' is present; otherwise, returns undefined.
     */
    getSjekklistekravForFritattFraNabovarsling(props, resourceBindings) {
        if (hasValue(props.fritattFraNabovarsling)) {
            const sjekklistepunktsvar = props.fritattFraNabovarsling;
            const kodebeskrivelse = getTextResourceFromResourceBinding(resourceBindings?.fritattFraNabovarsling?.title);
            return new Sjekklistekrav({
                sjekklistepunktsvar,
                sjekklistepunkt: { kodebeskrivelse }
            });
        }
    }

    /**
     * Generates a Sjekklistekrav object for the 'foreliggerMerknader' field if it has a value.
     *
     * @param {Object} data - The data object containing the 'foreliggerMerknader' property.
     * @param {Object} resourceBindings - The resource bindings object, potentially containing text resources for 'foreliggerMerknader'.
     * @returns {Sjekklistekrav|undefined} A new Sjekklistekrav instance if 'foreliggerMerknader' has a value, otherwise undefined.
     */
    getSjekklistekravForForeliggerMerknader(data, resourceBindings) {
        if (hasValue(data.foreliggerMerknader)) {
            const sjekklistepunktsvar = data.foreliggerMerknader;
            const kodebeskrivelse = getTextResourceFromResourceBinding(resourceBindings?.foreliggerMerknader?.title);
            return new Sjekklistekrav({
                sjekklistepunktsvar,
                sjekklistepunkt: { kodebeskrivelse }
            });
        }
    }

    /**
     * Generates resource bindings for a component based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {string} [props.resourceBindings.trueText] - Text to display for true value.
     * @param {string} [props.resourceBindings.falseText] - Text to display for false value.
     * @param {string} [props.resourceBindings.defaultText] - Default text to display.
     * @param {string} [props.resourceBindings.fritattFraNabovarsling] - Resource bindings for 'fritattFraNabovarsling'.
     * @param {string} [props.resourceBindings.foreliggerMerknader] - Resource bindings for 'foreliggerMerknader'.
     * @param {string} [props.resourceBindings.title] - Title text for the component.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when field is empty.
     * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text.
     * @returns {Object} An object containing the resource bindings for the varsling component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            varsling: {
                trueText: props?.resourceBindings?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.falseText || "resource.falseText.default",
                defaultText: props?.resourceBindings?.defaultText || "resource.defaultText.default"
            },
            fritattFraNabovarsling: {
                title: props?.resourceBindings?.fritattFraNabovarsling?.title || `resource.varsling.fritattFraNabovarsling.title`
            },
            foreliggerMerknader: {
                title: props?.resourceBindings?.foreliggerMerknader?.title || `resource.varsling.foreliggerMerknader.title`
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.varsling = {
                ...resourceBindings.varsling,
                title: props?.resourceBindings?.title || "resource.varsling.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.varsling = {
                ...resourceBindings.varsling,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
