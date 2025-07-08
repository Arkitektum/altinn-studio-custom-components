// Classes
import CustomComponent from "../CustomComponent.js";
import Eiendom from "../../data-classes/Eiendom.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableEiendom is a custom component class for handling and displaying a list of "eiendom" (property) objects.
 * It provides utility methods for extracting, validating, and formatting property data from form input,
 * as well as for retrieving localized text resources and validation messages.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties containing form data, resource bindings, and component information.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {boolean} validationMessages - Indicates if there are missing text resources for validation.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceValues - Contains localized text resources for the component.
 * @property {string} resourceValues.title - The localized title for the component.
 * @property {string|Array} resourceValues.data - The localized empty field text or the data array.
 *
 */
export default class CustomTableEiendom extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const textResourceBindings = this.getTextResourceBindings();

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(textResourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);

        this.resourceValues = {
            title: getTextResourceFromResourceBinding(textResourceBindings?.part?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the list of "eiendom" objects from the form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {Array} The extracted list of "eiendom" objects from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const eiendomList = this.getEiendomListFromData(data);
        return eiendomList;
    }

    /**
     * Transforms an array of raw eiendom data into an array of Eiendom instances,
     * filtering out any instances that do not have a valid value.
     *
     * @param {Array<Object>} data - The raw data array to be transformed.
     * @returns {Eiendom[]|undefined} An array of Eiendom instances with valid values, or undefined if input is invalid.
     */
    getEiendomListFromData(data) {
        if (!hasValue(data)) {
            return undefined;
        }
        return data.map((eiendom) => new Eiendom(eiendom)).filter((eiendom) => this.hasEiendomValue(eiendom));
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
     * Checks if the provided data contains any content.
     *
     * @param {Object} data - The data object to check.
     * @returns {boolean} Returns true if the data contains a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Checks if the given property object has either a zip code or a city in its address.
     *
     * @param {Object} eiendom - The property object to check.
     * @param {Object} [eiendom.adresse] - The address object of the property.
     * @param {string|number} [eiendom.adresse.postnr] - The zip code of the address.
     * @param {string} [eiendom.adresse.poststed] - The city of the address.
     * @returns {boolean} Returns true if either zip code or city is present and has a value, otherwise false.
     */
    hasZipCodeOrCity(eiendom) {
        return hasValue(eiendom?.adresse?.postnr) || hasValue(eiendom?.adresse?.poststed);
    }

    /**
     * Checks if the given 'eiendom' object has at least one non-empty address line.
     *
     * @param {Object} eiendom - The property object to check.
     * @param {Object} [eiendom.adresse] - The address object within the property.
     * @param {string} [eiendom.adresse.adresselinje1] - The first address line.
     * @param {string} [eiendom.adresse.adresselinje2] - The second address line.
     * @param {string} [eiendom.adresse.adresselinje3] - The third address line.
     * @returns {boolean} True if any address line is present and has a value, otherwise false.
     */
    hasAdresseLinje(eiendom) {
        return hasValue(eiendom?.adresse?.adresselinje1) || hasValue(eiendom?.adresse?.adresselinje2) || hasValue(eiendom?.adresse?.adresselinje3);
    }

    /**
     * Determines if the given 'eiendom' object has an address.
     * Checks if either an address line or a zip code/city is present.
     *
     * @param {Object} eiendom - The property object to check for address information.
     * @returns {boolean} True if the property has an address line or zip code/city, otherwise false.
     */
    hasAdresse(eiendom) {
        return this.hasAdresseLinje(eiendom) || this.hasZipCodeOrCity(eiendom);
    }

    /**
     * Checks if the given `eiendom` object contains any of the relevant property number fields.
     *
     * @param {Object} eiendom - The property object to check.
     * @param {string} [eiendom.bolignummer] - The housing number.
     * @param {string} [eiendom.bygningsnummer] - The building number.
     * @param {Object} [eiendom.eiendomsidentifikasjon] - The property identification object.
     * @param {string} [eiendom.eiendomsidentifikasjon.gaardsnummer] - The farm number.
     * @param {string} [eiendom.eiendomsidentifikasjon.bruksnummer] - The usage number.
     * @param {string} [eiendom.eiendomsidentifikasjon.seksjonsnummer] - The section number.
     * @param {string} [eiendom.eiendomsidentifikasjon.festenummer] - The lease number.
     * @returns {boolean} Returns true if any of the property number fields are present and have a value, otherwise false.
     */
    hasEiendomNummerField(eiendom) {
        return (
            hasValue(eiendom?.bolignummer) ||
            hasValue(eiendom?.bygningsnummer) ||
            hasValue(eiendom?.eiendomsidentifikasjon?.gaardsnummer) ||
            hasValue(eiendom?.eiendomsidentifikasjon?.bruksnummer) ||
            hasValue(eiendom?.eiendomsidentifikasjon?.seksjonsnummer) ||
            hasValue(eiendom?.eiendomsidentifikasjon?.festenummer)
        );
    }

    /**
     * Checks if the provided `eiendom` object contains any valid property
     * related to an "eiendomnummer" (property number).
     *
     * The function returns `true` if at least one of the following properties
     * has a value:
     * - `bolignummer`
     * - `bygningsnummer`
     * - `eiendomsidentifikasjon.gaardsnummer`
     * - `eiendomsidentifikasjon.bruksnummer`
     * - `eiendomsidentifikasjon.seksjonsnummer`
     * - `eiendomsidentifikasjon.festenummer`
     *
     * @param {Object} eiendom - The property object to check.
     * @returns {boolean} `true` if any of the relevant fields have a value, otherwise `false`.
     */
    hasEiendomValue(eiendom) {
        return this.hasAdresse(eiendom) || this.hasEiendomNummerField(eiendom);
    }

    /**
     * Returns the text resource bindings for the component.
     *
     * @returns {Object} An object containing text resource keys for localization.
     * @returns {Object} return.eiendomByggested - Bindings related to 'eiendomByggested'.
     * @returns {string} return.eiendomByggested.title - The resource key for the 'eiendom' title.
     */
    getTextResourceBindings() {
        return {
            eiendomByggested: {
                title: "resource.eiendomByggested.eiendom.title"
            }
        };
    }
}
