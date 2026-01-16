// Classes
import CustomComponent from "../CustomComponent.js";
import Eiendom from "../../data-classes/Eiendom.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableEiendom is a specialized component class for handling and displaying
 * property ("eiendom") data in a custom table format. It provides methods for extracting,
 * validating, and binding text resources to property fields, as well as utility functions
 * for checking the presence and validity of property-related data.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the property data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are missing text resources for validation.
 * @property {Object} validationMessages - Validation messages based on text resource bindings.
 * @property {Object} resourceBindings - Text resource bindings for property fields.
 * @property {Object} resourceValues - Resolved text resources for display, including empty field text.
 */
export default class CustomTableEiendom extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.eiendomByggested?.emptyFieldText) : data
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
     * Checks if the given `eiendom` object has a non-empty `kommunenavn` property.
     *
     * @param {Object} eiendom - The object representing an eiendom (property).
     * @returns {boolean} Returns true if `eiendom.kommunenavn` has a value, otherwise false.
     */
    hasKommunenavn(eiendom) {
        return hasValue(eiendom?.kommunenavn);
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
     * Determines if the given 'eiendom' object has address information.
     * Checks for the presence of an address line, zip code or city, or municipality name.
     *
     * @param {Object} eiendom - The property object to check for address information.
     * @returns {boolean} True if any address-related information is present, otherwise false.
     */
    hasAdresse(eiendom) {
        return this.hasAdresseLinje(eiendom) || this.hasZipCodeOrCity(eiendom) || this.hasKommunenavn(eiendom);
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
     * related to an "eiendomNummer" (property number).
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
     * Generates an object containing text resource bindings for various property fields.
     * Each field includes a `title` and `emptyFieldText`, which can be overridden by values in `props.resourceBindings`.
     * Default resource keys are used if overrides are not provided.
     * Optionally adds `eiendomByggested` resource bindings based on `hideTitle` and `hideIfEmpty` props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings to override defaults.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omits the `eiendomByggested.title` binding.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the `eiendomByggested.emptyFieldText` binding.
     * @returns {Object} An object containing resource bindings for property fields.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            adresse: {
                title: props?.resourceBindings?.adresse?.title || "resource.eiendomByggested.eiendom.adresse.title",
                emptyFieldText: props?.resourceBindings?.adresse?.emptyFieldText || "resource.eiendomByggested.eiendom.adresse.emptyFieldText"
            },
            eiendomsidentifikasjonGaardsnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.title ||
                    "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonBruksnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.title ||
                    "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonSeksjonsnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.title ||
                    "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonFestenummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.title ||
                    "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bolignummer: {
                title: props?.resourceBindings?.bolignummer?.title || "resource.eiendomByggested.eiendom.bolignummer.title",
                emptyFieldText: props?.resourceBindings?.bolignummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bygningsnummer: {
                title: props?.resourceBindings?.bygningsnummer?.title || "resource.eiendomByggested.eiendom.bygningsnummer.title",
                emptyFieldText: props?.resourceBindings?.bygningsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.eiendomByggested = {
                title: props?.resourceBindings?.title || "resource.eiendomByggested.eiendom.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.eiendomByggested = {
                ...resourceBindings?.eiendomByggested,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
