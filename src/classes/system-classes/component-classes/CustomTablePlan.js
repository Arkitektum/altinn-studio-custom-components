// Classes
import CustomComponent from "../CustomComponent.js";
import AndrePlaner from "../../data-classes/AndrePlaner.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTablePlan is a custom component class for handling table plan data and resource bindings.
 * It manages validation messages, resource values, and content checks for a custom table plan.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @param {Object} [props.resourceBindings] - Optional resource bindings for customizing text.
 * @param {Object} [props.resourceBindings.navn] - Resource bindings for the "navn" field.
 * @param {string} [props.resourceBindings.navn.title] - Custom title for the "navn" field.
 * @param {string} [props.resourceBindings.navn.emptyFieldText] - Custom empty field text for the "navn" field.
 * @param {Object} [props.resourceBindings.plantype] - Resource bindings for the "plantype" field.
 * @param {string} [props.resourceBindings.plantype.title] - Custom title for the "plantype" field.
 * @param {string} [props.resourceBindings.plantype.emptyFieldText] - Custom empty field text for the "plantype" field.
 * @param {string} [props.resourceBindings.title] - Custom title for the plan.
 * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text for the plan.
 * @param {boolean|string} [props.hideTitle] - If true, hides the plan title.
 * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for the plan.
 *
 * @property {boolean} isEmpty - Indicates if the plan data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} validationMessages - Validation messages for the component.
 * @property {Object} resourceBindings - Resource bindings for text resources.
 * @property {Object} resourceValues - Resource values for rendering.
 */
export default class CustomTablePlan extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.plan?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the value for 'plan' from the form data in the provided props.
     * Utilizes `getComponentDataValue` to extract data and constructs an `AndrePlaner` instance.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {*} The 'plan' value extracted from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const andrePlaner = new AndrePlaner({ plan: data });
        return andrePlaner?.plan;
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {boolean} Returns true if there are missing text resources, otherwise false.
     */
    getValidationMessages(textResourceBindings) {
        return hasMissingTextResources(textResourceBindings);
    }

    /**
     * Checks if the provided data contains any content.
     *
     * @param {Object} data - The data object to check.
     * @returns {boolean} Returns true if the data contains a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Generates an object containing text resource bindings for a custom table plan component.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings for customizing text.
     * @param {Object} [props.resourceBindings.navn] - Resource bindings for the "navn" field.
     * @param {string} [props.resourceBindings.navn.title] - Custom title for the "navn" field.
     * @param {string} [props.resourceBindings.navn.emptyFieldText] - Custom empty field text for the "navn" field.
     * @param {Object} [props.resourceBindings.plantype] - Resource bindings for the "plantype" field.
     * @param {string} [props.resourceBindings.plantype.title] - Custom title for the "plantype" field.
     * @param {string} [props.resourceBindings.plantype.emptyFieldText] - Custom empty field text for the "plantype" field.
     * @param {string} [props.resourceBindings.title] - Custom title for the plan.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text for the plan.
     * @param {boolean|string} [props.hideTitle] - If true, hides the plan title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for the plan.
     * @returns {Object} An object containing resource bindings for plan, navn, and plantype fields.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            plan: {},
            navn: {
                title: props?.resourceBindings?.navn?.title || `resource.planer.andrePlaner.plan.navn.title`,
                emptyFieldText: props?.resourceBindings?.navn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            plantype: {
                title: props?.resourceBindings?.plantype?.title || `resource.planer.andrePlaner.plan.plantype.title`,
                emptyFieldText: props?.resourceBindings?.plantype?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.plan = {
                title: props?.resourceBindings?.title || "resource.planer.andrePlaner.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.plan = {
                ...resourceBindings.plan,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
