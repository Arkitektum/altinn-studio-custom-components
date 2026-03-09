// Classes
import CustomComponent from "../CustomComponent.js";
import Dispensasjonsvarsel from "../../layout-classes/Dispensasjonsvarsel.js";

// Global functions
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomDispensasjonsvarsel is a custom component class that extends the base CustomComponent class. It is designed to represent a "dispensasjonsvarsel" (dispensation notice) in a user interface, providing functionality to determine if the component has content, retrieve values from form data, and manage resource bindings and validation messages.
 *
 * The class includes methods to check if the component has content, extract values from form data, validate text resources, and determine specific types of dispensation cases based on the provided data. It also defines the resource bindings for various text elements that may be displayed within the component.
 *
 * This class is intended to be used in conjunction with a corresponding custom element definition that renders the visual representation of the dispensation notice based on the properties and methods defined here.
 *
 * @class
 * @extends CustomComponent
 * @param {Object} props - The properties object containing form data and configuration for the component.
 * @param {*} props.formData - The form data to be validated and used for instantiation.
 * @property {boolean} isEmpty - Indicates if the component has no content.
 * @property {boolean} isPlanBestemmelsesType - Indicates if the data corresponds to a specific type of dispensation case.
 * @property {boolean} isAndrePlanbestemmelser - Indicates if the data corresponds to "Andre Planbestemmelser" type.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - An object containing resource binding keys for localization.
 * @property {Object} resourceValues - An object containing values for resource bindings, including fallback for empty data.
 * @returns {CustomDispensasjonsvarsel} An instance of the CustomDispensasjonsvarsel class with properties and methods for managing dispensation notice data and behavior.
 */
export default class CustomDispensasjonsvarsel extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const isPlanBestemmelsesType = this.dataIsPlanBestemmelsesType(data);
        const isAndrePlanbestemmelser = this.dataIsAndrePlanbestemmelser(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.isPlanBestemmelsesType = isPlanBestemmelsesType;
        this.isAndrePlanbestemmelser = isAndrePlanbestemmelser;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data value contains content.
     *
     * @param {*} data - The value from the data to check.
     * @returns {boolean} Returns true if the value has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves the value for the component from the provided form data.
     * If the form data contains a value, it creates and returns a new instance of the Dispensasjonsvarsel class using that data.
     *
     * @param {Object} props - The properties object that may contain form data.
     * @returns {Dispensasjonsvarsel|boolean} An instance of the Dispensasjonsvarsel class if form data is present, otherwise false.
     */
    getValueFromFormData(props) {
        return hasValue(props?.formData) && new Dispensasjonsvarsel(props.formData);
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {Array|string|boolean} The result of the hasMissingTextResources function, indicating missing text resources.
     */
    getValidationMessages(textResourceBindings) {
        return hasMissingTextResources(textResourceBindings);
    }

    /**
     * Checks if the given dispensasjon object has a bestemmelserType code value
     * that matches one of the predefined plan bestemmelse types.
     *
     * @param {Object} data - The dispensasjon object to check.
     * @param {Object} [data.dispensasjonFra] - The object containing details about the dispensasjon.
     * @param {Object} [data.dispensasjonFra.bestemmelserType] - The object containing the type of bestemmelse.
     * @param {string} [data.dispensasjonFra.bestemmelserType.kodeverdi] - The code value of the bestemmelse type.
     * @returns {boolean} - Returns true if the code value matches one of the predefined plan bestemmelse types, otherwise false.
     */
    dataIsPlanBestemmelsesType(data) {
        const planBestemmelseTypeValues = ["REG", "KOM"];
        return planBestemmelseTypeValues.includes(data?.bestemmelsestype?.kodeverdi?.toUpperCase());
    }

    /**
     * Checks if the given dispensasjon object has a dispensasjonstema code value
     * that matches "andrePlanbestemmelser".
     *
     * @param {Object} data - The dispensasjon object to check.
     * @param {Object} [data.dispensasjonstema] - The object containing the title of the dispensasjon.
     * @param {string} [data.dispensasjonstema.kodeverdi] - The code value of the dispensasjon title.
     * @returns {boolean} - Returns true if the code value matches "andrePlanbestemmelser", otherwise false.
     */
    dataIsAndrePlanbestemmelser(data) {
        return data?.dispensasjonstema?.kodeverdi?.toUpperCase() === "ANDREPLANBESTEMMELSER";
    }

    /**
     * Retrieves the resource bindings for the CustomDispensasjonsvarsel component, providing default values if specific bindings are not present in the props.
     *
     * @param {Object} props - The properties object that may contain resource bindings.
     * @returns {Object} An object containing the resource bindings for various text elements in the component, with default values as fallbacks.
     */
    getResourceBindings(props) {
        return {
            bestemmelse: {
                title: props?.resourceBindings?.bestemmelse?.title || "resource.dispensasjonsvarsel.bestemmelse.title"
            },
            dispensasjonsvarsel: {
                title: props?.resourceBindings?.dispensasjonsvarsel?.title || "resource.dispensasjonsvarsel.title"
            },
            dispVarselBeskrivelse: {
                title: props?.resourceBindings?.dispVarselBeskrivelse?.title || "resource.dispensasjonsvarsel.dispVarselBeskrivelse.title"
            },
            emne: {
                title: props?.resourceBindings?.emne?.title || "resource.emne.title"
            },
            plannavn: {
                title: props?.resourceBindings?.plannavn?.title || "resource.dispensasjonsvarsel.plannavn.title"
            },
            paragrafnummer: {
                title: props?.resourceBindings?.paragrafnummer?.title || "resource.dispensasjonsvarsel.paragrafnummer.title"
            },
            spoersmaalOmDispensasjonssoeknaden: {
                title:
                    props?.resourceBindings?.spoersmaalOmDispensasjonssoeknaden?.title ||
                    "resource.dispensasjonsvarsel.spoersmaalOmDispensasjonssoeknaden.title"
            }
        };
    }
}
