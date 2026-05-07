// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";
import DispensasjonOversikt from "../../data-classes/DispensasjonOversikt.js";

// Global functions
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import { getComponentDataValue } from "../../../functions/helpers.js";

/**
 * CustomGroupDispensasjonOversikt is a custom component class that extends the base CustomComponent class.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for initializing the component.
 * @param {Object} [props.resourceBindings] - Custom resource binding values for fields.
 * @param {Object} [props.resourceValues] - Custom resource values for fields.
 *
 * @property {boolean} isEmpty - Indicates if the dispensasjon data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for component fields.
 * @property {Object} resourceValues - Resource values for title and data.
 *
 * @returns {CustomGroupDispensasjonOversikt} An instance of CustomGroupDispensasjonOversikt initialized with the provided properties.
 */
export default class CustomGroupDispensasjonOversikt extends CustomComponent {
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
                : getTextResourceFromResourceBinding(resourceBindings?.dispensasjonOversikt?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.dispensasjonOversikt?.emptyFieldText) : data
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
     * Retrieves the value from the form data and initializes a DispensasjonOversikt instance.
     *
     * @param {*} props - The properties object containing form data.
     * @returns {DispensasjonOversikt} An instance of DispensasjonOversikt initialized with the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const dispensasjonOversikt = new DispensasjonOversikt(data);
        return dispensasjonOversikt;
    }

    /**
     * Retrieves resource bindings based on provided properties.
     *
     * @param {*} props - The properties object containing resource bindings.
     * @returns {Object} An object containing the resource bindings for the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            count: {
                title: props?.resourceBindings?.count?.title || "resource.dispensasjonOversikt.dispensasjon.count.title",
                emptyFieldText: props?.resourceBindings?.count?.emptyFieldText || "resource.emptyFieldText.zero"
            },
            dispensasjon: {
                rowNumberTitle: props?.resourceBindings?.dispensasjon?.rowNumberTitle || "resource.nummer.short",
                dispensasjonKategori: props?.resourceBindings?.dispensasjon?.dispensasjonKategori || "resource.kategori.title",
                dispensasjonTittel: props?.resourceBindings?.dispensasjon?.dispensasjonTittel || "resource.emne.title",
                bestemmelserType:
                    props?.resourceBindings?.dispensasjon?.bestemmelserType || "resource.dispensasjonOversikt.dispensasjon.bestemmelserType.title",
                emptyFieldText: props?.resourceBindings?.dispensasjon?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.dispensasjonOversikt = {
                title: props?.resourceBindings?.title || "resource.dispensasjonOversikt.header"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.dispensasjonOversikt = {
                ...resourceBindings.dispensasjonOversikt,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-feedbacklist-validation-messages", "custom-field-count-data", "custom-header-text", "custom-paragraph", "custom-table-data"];
    }
}
