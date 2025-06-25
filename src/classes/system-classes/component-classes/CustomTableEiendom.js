// Classes
import CustomComponent from "../CustomComponent.js";
import Eiendom from "../../data-classes/Eiendom.js";

// Global functions
import { getTextResourcesFromResourceBindings, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

export default class CustomTableEiendom extends CustomComponent {
    constructor(element) {
        super(element);
        const textResourceBindings = this.getTextResourceBindings();
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];

        const parentProps = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const localProps = element instanceof HTMLElement ? this.getLocalPropsFromElementAttributes(textResources, textResourceBindings) : element;
        const props = { ...parentProps, ...localProps };

        const formData = this.getFormDataFromProps(props);
        const isEmpty = !this.hasContent(formData);
        const validationMessages = this.getValidationMessages(textResourceBindings);

        this.isEmpty = isEmpty;
        this.formData = formData;
        this.texts = localProps?.texts ? localProps.texts : {};
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.textResourceBindings = textResourceBindings;
    }

    /**
     * Extracts local properties from element attributes by retrieving text resources
     * based on provided resource bindings.
     *
     * @param {Array<Object>} textResources - The list of available text resources.
     * @param {Object} textResourceBindings - The bindings for text resources, expected to contain `eiendomByggested`.
     * @returns {Object} An object containing the resolved `texts` property.
     */
    getLocalPropsFromElementAttributes(textResources, textResourceBindings) {
        const texts = getTextResourcesFromResourceBindings(textResources, textResourceBindings.eiendomByggested);
        return {
            texts
        };
    }

    /**
     * Extracts and formats form data from the provided props object.
     *
     * @param {Object} props - The properties object containing data for the component.
     * @returns {Object} An object with a `data` property containing the list of eiendom items.
     */
    getFormDataFromProps(props) {
        const eiendomList = this.getEiendomListFromProps(props);
        return {
            data: eiendomList
        };
    }

    /**
     * Retrieves a list of Eiendom instances from the provided props object.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {Object} props.formData - The form data object.
     * @param {Array<Object>} props.formData.data - The array of eiendom data objects.
     * @returns {Eiendom[]|undefined} An array of Eiendom instances with valid values, or undefined if no data is present.
     */
    getEiendomListFromProps(props) {
        const data = props?.formData?.data;
        if (!hasValue(data)) {
            return undefined;
        }
        return props.formData.data.map((eiendom) => new Eiendom(eiendom)).filter((eiendom) => this.hasEiendomValue(eiendom));
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
     * @param {Object} formData - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData?.data);
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
     * Returns an object containing text resource bindings for the "eiendomByggested" component.
     * The returned object maps keys such as titles and column identifiers to their corresponding resource strings.
     *
     * @returns {Object} An object with text resource bindings for various fields and columns related to "eiendomByggested".
     */
    getTextResourceBindings() {
        return {
            eiendomByggested: {
                title: "resource.eiendomByggested.eiendom.title",
                "col-1": "resource.eiendomByggested.eiendom.adresse.title",
                "col-2": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
                "col-3": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
                "col-4": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
                "col-5": "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
                "col-6": "resource.eiendomByggested.eiendom.bolignummer.title",
                "col-7": "resource.eiendomByggested.eiendom.bygningsnummer.title",
                "emptyFieldText-col-1": "resource.eiendomByggested.eiendom.adresse.emptyFieldText",
                "emptyFieldText-default": "resource.emptyFieldText.default"
            }
        };
    }
}
