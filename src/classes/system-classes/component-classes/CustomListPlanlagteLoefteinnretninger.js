// Classes
import CustomComponent from "../CustomComponent.js";
import Loefteinnretninger from "../../data-classes/Loefteinnretninger.js";
import PlanlagteLoefteinnretningerList from "../data-classes/PlanlagteLoefteinnretningerList.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomListPlanlagteLoefteinnretninger is a custom component class for handling planned lift installations.
 * It extracts relevant data from form data, manages text resource bindings, and handles validation messages.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the extracted data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} validationMessages - The validation messages for the component.
 * @property {Object} resourceBindings - The resolved text resource bindings for the component.
 * @property {Object} resourceValues - The resolved text resource values for the component.
 */
export default class CustomListPlanlagteLoefteinnretninger extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getTextResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);
        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = {
            emptyFieldText: resourceBindings?.loefteinnretninger?.emptyFieldText || undefined
        };
        this.resourceValues = {
            title: !props?.hideTitle && getTextResourceFromResourceBinding(resourceBindings?.loefteinnretninger?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.loefteinnretninger?.emptyFieldText) : data
        };
    }

    /**
     * Extracts and returns the relevant data from form data using resource bindings.
     *
     * @param {Object} props - The properties containing form data.
     * @param {Object} resourceBindings - The resource bindings used to map data.
     * @returns {any|undefined} The extracted data if available, otherwise undefined.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return undefined;
        }
        const loefteinnretninger = new Loefteinnretninger(data);
        const planlagteLoefteinnretningerList = new PlanlagteLoefteinnretningerList(loefteinnretninger, resourceBindings);
        return hasValue(planlagteLoefteinnretningerList?.resourceValues?.data) ? planlagteLoefteinnretningerList.resourceValues.data : undefined;
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {boolean} Returns true if there are missing text resources, otherwise false.
     */
    getValidationMessages(textResourceBindings) {
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];
        return hasMissingTextResources(textResources, textResourceBindings);
    }

    /**
     * Checks if the provided form data contains any content.
     *
     * @param {Object} formDataValue - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Generates an object containing text resource bindings for various lift-related components.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings for overriding default text resources.
     * @param {Object} [props.resourceBindings.planleggesHeis] - Resource bindings for "planleggesHeis".
     * @param {string} [props.resourceBindings.planleggesHeis.title] - Title for "planleggesHeis".
     * @param {Object} [props.resourceBindings.planleggesLoefteplattform] - Resource bindings for "planleggesLoefteplattform".
     * @param {string} [props.resourceBindings.planleggesLoefteplattform.title] - Title for "planleggesLoefteplattform".
     * @param {Object} [props.resourceBindings.planleggesRulletrapp] - Resource bindings for "planleggesRulletrapp".
     * @param {string} [props.resourceBindings.planleggesRulletrapp.title] - Title for "planleggesRulletrapp".
     * @param {Object} [props.resourceBindings.planleggesTrappeheis] - Resource bindings for "planleggesTrappeheis".
     * @param {string} [props.resourceBindings.planleggesTrappeheis.title] - Title for "planleggesTrappeheis".
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when a field is empty.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the "loefteinnretninger" empty field text binding.
     * @returns {Object} An object containing the resolved text resource bindings.
     */
    getTextResourceBindings(props) {
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
            }
        };
        if (!props?.hideTitle === true || !props?.hideTitle === "true") {
            resourceBindings.loefteinnretninger = {
                title: props?.resourceBindings?.title || "resource.loefteinnretninger.title"
            };
        }
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.loefteinnretninger = {
                ...resourceBindings.loefteinnretninger,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
