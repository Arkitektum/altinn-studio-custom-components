// Classes
import CustomComponent from "../CustomComponent.js";
import AndrePlaner from "../../data-classes/AndrePlaner.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGrouplistPlan is a custom component class for handling group list plans.
 * It manages resource bindings, validation messages, and content state for a plan component.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component.
 * @param {Object} props.resourceBindings - Resource bindings for text resources.
 * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'andrePlaner'.
 * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'andrePlaner'.
 *
 * @property {boolean} isEmpty - Indicates if the plan data is empty.
 * @property {Array|string} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for 'navn' and 'plantype'.
 * @property {Object} resourceValues - Resource values for title and data.
 */
export default class CustomGrouplistPlan extends CustomComponent {
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
            navn: resourceBindings?.navn,
            plantype: resourceBindings?.plantype
        };
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.andrePlaner?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.andrePlaner?.emptyFieldText) : data
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
     * Retrieves the value of the 'plan' property from the form data.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {*} The value of the 'plan' property from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const andrePlaner = new AndrePlaner({ plan: data });
        return andrePlaner?.plan;
    }

    /**
     * Generates resource bindings for a custom group list plan component.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {Object} [props.resourceBindings.navn] - Resource binding for 'navn'.
     * @param {string} [props.resourceBindings.navn.title] - Title for 'navn'.
     * @param {Object} [props.resourceBindings.plantype] - Resource binding for 'plantype'.
     * @param {string} [props.resourceBindings.plantype.title] - Title for 'plantype'.
     * @param {string} [props.resourceBindings.title] - Title for 'andrePlaner'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text for empty field in 'andrePlaner'.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'andrePlaner'.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'andrePlaner'.
     * @returns {Object} Resource bindings object for the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            andrePlaner: {},
            navn: {
                title: props?.resourceBindings?.navn?.title || `resource.planer.andrePlaner.plan.navn.title`
            },
            plantype: {
                title: props?.resourceBindings?.plantype?.title || `resource.planer.andrePlaner.plan.plantype.title`
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.andrePlaner = {
                ...resourceBindings.andrePlaner,
                title: props?.resourceBindings?.title || "resource.planer.andrePlaner.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.andrePlaner = {
                ...resourceBindings.andrePlaner,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
