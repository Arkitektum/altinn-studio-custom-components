// Classes
import CustomComponent from "../CustomComponent.js";
import NaboGjenboerEiendom from "../../data-classes/NaboGjenboerEiendom.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupNaboGjenboerEiendom is a custom component class for handling
 * neighbor/adjacent property information within a form. It extends CustomComponent
 * and provides logic for extracting, validating, and binding resources for
 * property-related fields.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {Object} [props.resourceBindings] - Optional custom resource binding values for fields.
 * @param {boolean|string} [props.hideIfEmpty] - If true, omits the `naboGjenboerEiendom` resource binding.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing or invalid resources.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource binding configuration for the component fields.
 * @property {Object} resourceValues - Resource values for the component, including empty field text or data.
 */
export default class CustomGroupNaboGjenboerEiendom extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.naboGjenboerEiendom?.emptyFieldText) : data
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
     * Retrieves the component data from the provided props,
     * creates a new instance of NaboGjenboerEiendom with that data,
     * and returns the instance.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {NaboGjenboerEiendom} An instance of NaboGjenboerEiendom initialized with the component data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const naboGjenboerEiendom = new NaboGjenboerEiendom(data);
        return naboGjenboerEiendom;
    }

    /**
     * Generates a set of resource binding objects for various property fields,
     * providing default resource keys if custom values are not supplied via props.
     *
     * @param {Object} props - The properties object containing optional resourceBindings and configuration.
     * @param {Object} [props.resourceBindings] - Optional custom resource binding values for fields.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the `naboGjenboerEiendom` resource binding.
     * @returns {Object} An object mapping field keys to their respective resource binding configurations.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            eiendomMatrikkelinformasjon: {
                title: props?.resourceBindings?.eiendom?.title || "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
            },
            eiendomMatrikkelinformasjonAdresse: {
                title: props?.resourceBindings?.adresse?.title || "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.title",
                emptyFieldText:
                    props?.resourceBindings?.adresse?.emptyFieldText ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.emptyFieldText"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.gaardsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.bruksnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.seksjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer: {
                title:
                    props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.festenummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonBolignummer: {
                title:
                    props?.resourceBindings?.bolignummer?.title || "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bolignummer.title",
                emptyFieldText: props?.resourceBindings?.bolignummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonBygningsnummer: {
                title:
                    props?.resourceBindings?.bygningsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bygningsnummer.title",
                emptyFieldText: props?.resourceBindings?.bygningsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eier: {
                title: props?.resourceBindings?.eier?.title || "resource.eier.header"
            },
            eierNavn: {
                title: props?.resourceBindings?.eierNavn?.title || "resource.eier.navn.title",
                emptyFieldText: props?.resourceBindings?.eierNavn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eierTelefonnummer: {
                title: props?.resourceBindings?.eierTelefonnummer?.title || "resource.eier.telefonnummer.title",
                emptyFieldText: props?.resourceBindings?.eierTelefonnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eierEpost: {
                title: props?.resourceBindings?.eierEpost?.title || "resource.eier.epost.title",
                emptyFieldText: props?.resourceBindings?.eierEpost?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eierAdresse: {
                title: props?.resourceBindings?.eierAdresse?.title || "resource.eier.adresse.title"
            },
            responsNabovarselSendtVia: {
                title: props?.resourceBindings?.responsNabovarselSendtVia?.title || "resource.respons.nabovarselSendtVia.title",
                emptyFieldText: props?.resourceBindings?.responsNabovarselSendtVia?.emptyFieldText || "resource.emptyFieldText.default"
            },
            responsMerknadMottattDato: {
                title: props?.resourceBindings?.responsMerknadMottattDato?.title || "resource.respons.merknadMottattDato.title",
                emptyFieldText: props?.resourceBindings?.responsMerknadMottattDato?.emptyFieldText || "resource.emptyFieldText.default"
            },
            responsErMerknadEllerSamtykkeMottatt: {
                title: props?.resourceBindings?.responsErMerknadEllerSamtykkeMottatt?.title || "resource.respons.erMerknadEllerSamtykkeMottatt.title",
                falseText:
                    props?.resourceBindings?.responsErMerknadEllerSamtykkeMottatt?.falseText ||
                    "resource.respons.erMerknadEllerSamtykkeMottatt.falseText"
            },
            responsErMerknadMottatt: {
                trueText: props?.resourceBindings?.responsErMerknadMottatt?.trueText || "resource.respons.erMerknadMottatt.trueText"
            },
            responsErSamtykkeMottatt: {
                trueText: props?.resourceBindings?.responsErSamtykkeMottatt?.trueText || "resource.respons.erSamtykkeMottatt.trueText"
            }
        };
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.naboGjenboerEiendom = {
                ...resourceBindings.naboGjenboerEiendom,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
