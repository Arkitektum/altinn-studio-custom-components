// Classes
import CustomComponent from "../CustomComponent.js";
import Plan from "../../data-classes/Plan.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupPlan is a specialized component class for handling group plan data and resource bindings.
 * Extends CustomComponent to provide additional logic for empty state, validation messages, and resource values.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @param {Object} [props.resourceBindings] - Optional resource bindings for customizing text resources.
 * @param {Object} [props.resourceBindings.navn] - Resource binding for 'navn' field.
 * @param {string} [props.resourceBindings.navn.title] - Title for 'navn' field.
 * @param {Object} [props.resourceBindings.plantype] - Resource binding for 'plantype' field.
 * @param {string} [props.resourceBindings.plantype.title] - Title for 'plantype' field.
 * @param {string} [props.resourceBindings.emptyFieldText] - Text resource for empty field state.
 * @param {boolean|string} [props.hideIfEmpty] - If true, hides the 'plan' resource binding.
 *
 * @property {boolean} isEmpty - Indicates if the plan data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings used by the component.
 * @property {Object} resourceValues - Resource values, including empty field text or plan data.
 */
export default class CustomGroupPlan extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.plan?.emptyFieldText) : data
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
     * Retrieves the value from form data, constructs a Plan instance from it, and returns the Plan.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Plan} An instance of the Plan class created from the component data value.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const plan = new Plan(data);
        return plan;
    }

    /**
     * Generates resource bindings for a custom group plan component.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {Object} [props.resourceBindings.navn] - Resource binding for 'navn'.
     * @param {string} [props.resourceBindings.navn.title] - Title for 'navn'.
     * @param {Object} [props.resourceBindings.plantype] - Resource binding for 'plantype'.
     * @param {string} [props.resourceBindings.plantype.title] - Title for 'plantype'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text for empty field.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the 'plan' resource binding.
     * @returns {Object} Resource bindings object for the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            navn: {
                title: props?.resourceBindings?.navn?.title || `resource.planer.andrePlaner.plan.navn.title`
            },
            plantype: {
                title: props?.resourceBindings?.plantype?.title || `resource.planer.andrePlaner.plan.plantype.title`
            }
        };
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.plan = {
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
