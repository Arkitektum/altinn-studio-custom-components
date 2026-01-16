// Classes
import CustomComponent from "../CustomComponent.js";
import Eiendom from "../../data-classes/Eiendom.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableEiendom is a specialized component class for handling and displaying property (eiendom) data.
 * It provides methods for extracting, validating, and binding resource texts for property information,
 * including address and identification fields. The class supports dynamic resource bindings and validation
 * message generation based on provided props and text resources.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 * @param {Object} [props.resourceBindings] - Custom resource bindings for various fields.
 * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title binding for eiendomByggested.
 * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the empty field text binding for eiendomByggested.
 *
 * @property {boolean} isEmpty - Indicates if the property data is empty.
 * @property {Array} validationMessages - Array of validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource bindings for address and property identification fields.
 * @property {Object} resourceValues - Resource values for displaying data or empty field text.
 *
 */
export default class CustomTableNaboGjenboerEiendom extends CustomComponent {
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
     * Retrieves the list of 'eiendom' objects from the form data.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Array} The list of 'eiendom' objects extracted from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const eiendomList = this.getEiendomListFromData(data);
        return eiendomList;
    }

    /**
     * Generates a list of Eiendom instances from the provided data array.
     * Each item in the array is mapped to a new Eiendom object using its `matrikkelinformasjon` property.
     * The resulting list is filtered to include only Eiendom objects that have valid values as determined by `hasEiendomValue`.
     *
     * @param {Array<Object>} data - The input array containing eiendom data objects.
     * @returns {Array<Eiendom>|undefined} An array of valid Eiendom instances, or undefined if input data is invalid.
     */
    getEiendomListFromData(data) {
        if (!hasValue(data)) {
            return undefined;
        }
        return data.map((eiendom) => new Eiendom(eiendom?.matrikkelinformasjon)).filter((eiendom) => this.hasEiendomValue(eiendom));
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing bindings for text resources.
     * @returns {Array} An array of missing text resource messages, if any.
     */
    getValidationMessages(textResourceBindings) {
        return hasMissingTextResources(textResourceBindings);
    }

    /**
     * Determines if the provided data has content by delegating to the hasValue function.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content; otherwise, false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Checks if the given property `kommunenavn` exists and has a value in the provided `eiendom` object.
     *
     * @param {Object} eiendom - The object representing an estate or property.
     * @returns {boolean} Returns `true` if `eiendom.kommunenavn` has a value, otherwise `false`.
     */
    hasKommunenavn(eiendom) {
        return hasValue(eiendom?.kommunenavn);
    }

    /**
     * Checks if the given property object has either a zip code or a city in its address.
     *
     * @param {Object} eiendom - The property object to check.
     * @param {Object} [eiendom.adresse] - The address object of the property.
     * @param {string} [eiendom.adresse.postnr] - The zip code of the address.
     * @param {string} [eiendom.adresse.poststed] - The city of the address.
     * @returns {boolean} True if either zip code or city is present; otherwise, false.
     */
    hasZipCodeOrCity(eiendom) {
        return hasValue(eiendom?.adresse?.postnr) || hasValue(eiendom?.adresse?.poststed);
    }

    /**
     * Checks if the given `eiendom` object has at least one non-empty address line.
     *
     * @param {Object} eiendom - The property object to check.
     * @param {Object} [eiendom.adresse] - The address object.
     * @param {string} [eiendom.adresse.adresselinje1] - First address line.
     * @param {string} [eiendom.adresse.adresselinje2] - Second address line.
     * @param {string} [eiendom.adresse.adresselinje3] - Third address line.
     * @returns {boolean} Returns `true` if any address line is present and has a value, otherwise `false`.
     */
    hasAdresseLinje(eiendom) {
        return hasValue(eiendom?.adresse?.adresselinje1) || hasValue(eiendom?.adresse?.adresselinje2) || hasValue(eiendom?.adresse?.adresselinje3);
    }

    /**
     * Determines if the given 'eiendom' object has address information.
     * Checks for the presence of address line, zip code or city, or municipality name.
     *
     * @param {Object} eiendom - The property object to check for address information.
     * @returns {boolean} True if address information is present, otherwise false.
     */
    hasAdresse(eiendom) {
        return this.hasAdresseLinje(eiendom) || this.hasZipCodeOrCity(eiendom) || this.hasKommunenavn(eiendom);
    }

    /**
     * Checks if the provided `eiendom` object contains any valid property related to property identification numbers.
     *
     * The function returns `true` if at least one of the following properties is present and has a value:
     * - `bolignummer`
     * - `bygningsnummer`
     * - `eiendomsidentifikasjon.gaardsnummer`
     * - `eiendomsidentifikasjon.bruksnummer`
     * - `eiendomsidentifikasjon.seksjonsnummer`
     * - `eiendomsidentifikasjon.festenummer`
     *
     * @param {Object} eiendom - The property object to check.
     * @returns {boolean} `true` if any of the identification number fields have a value, otherwise `false`.
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
     * Checks if the provided eiendom object has either an address or an eiendom number field.
     *
     * @param {Object} eiendom - The eiendom object to check.
     * @returns {boolean} Returns true if eiendom has an address or an eiendom number field, otherwise false.
     */
    hasEiendomValue(eiendom) {
        return this.hasAdresse(eiendom) || this.hasEiendomNummerField(eiendom);
    }

    /**
     * Generates resource binding objects for various property fields, providing default titles and empty field texts.
     * Optionally includes additional bindings based on `hideTitle` and `hideIfEmpty` props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Custom resource bindings for fields.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title binding for `eiendomByggested`.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the empty field text binding for `eiendomByggested`.
     * @returns {Object} Resource bindings for address and property identification fields.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            adresse: {
                title: props?.resourceBindings?.adresse?.title || "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.title",
                emptyFieldText: props?.resourceBindings?.adresse?.emptyFieldText || "resource.eiendomByggested.eiendom.adresse.emptyFieldText"
            },
            eiendomsidentifikasjonGaardsnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.gaardsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonBruksnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.bruksnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonSeksjonsnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.seksjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonFestenummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.festenummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bolignummer: {
                title:
                    props?.resourceBindings?.bolignummer?.title || "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bolignummer.title",
                emptyFieldText: props?.resourceBindings?.bolignummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bygningsnummer: {
                title:
                    props?.resourceBindings?.bygningsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bygningsnummer.title",
                emptyFieldText: props?.resourceBindings?.bygningsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.eiendomByggested = {
                title: props?.resourceBindings?.title || "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
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
