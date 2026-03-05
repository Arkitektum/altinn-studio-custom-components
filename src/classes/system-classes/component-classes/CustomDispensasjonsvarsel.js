// Classes
import CustomComponent from "../CustomComponent.js";
import Dispensasjonsvarsel from "../../layout-classes/Dispensasjonsvarsel.js";

// Global functions
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

export default class CustomDispensasjonsvarsel extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings();

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

    getResourceBindings() {
        return {
            emne: {
                title: "resource.emne.title"
            },
            dispensasjonsvarsel: {
                title: "resource.dispensasjonsvarsel.title"
            },
            bestemmelse: {
                title: "resource.dispensasjonsvarsel.bestemmelse.title"
            },
            plannavn: {
                title: "resource.dispensasjonsvarsel.plannavn.title"
            },
            paragrafnummer: {
                title: "resource.dispensasjonsvarsel.paragrafnummer.title"
            }
        };
    }
}
