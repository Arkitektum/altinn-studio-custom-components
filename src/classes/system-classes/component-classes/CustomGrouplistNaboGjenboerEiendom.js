// Classes
import CustomComponent from "../CustomComponent.js";
import NaboGjenboerEiendom from "../../data-classes/NaboGjenboerEiendom.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

/**
 * CustomGrouplistNaboGjenboerEiendom is a custom component class for handling and displaying
 * a list of neighboring or adjacent property information (Nabo/Gjenboer Eiendom) in a form.
 * It manages resource bindings for localization, validation messages, and data extraction
 * from form properties, supporting dynamic configuration and localization of field titles,
 * empty field texts, and other display strings.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing form data, resource bindings, and display flags.
 * @param {Object} [props.resourceBindings] - Optional overrides for resource binding values.
 * @param {boolean|string} [props.hideTitle] - If true, omits the main title resource binding.
 * @param {boolean|string} [props.hideIfEmpty] - If true, omits the empty field text for the main resource binding.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Object} resourceBindings - The resolved resource binding configuration for all fields.
 * @property {Object} resourceValues - Contains the localized title and data or empty field text.
 */
export default class CustomGrouplistNaboGjenboerEiendom extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceBindings = {
            eiendomMatrikkelinformasjon: resourceBindings?.eiendomMatrikkelinformasjon,
            eiendomMatrikkelinformasjonAdresse: resourceBindings?.eiendomMatrikkelinformasjonAdresse,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer:
                resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer:
                resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer:
                resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer,
            eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer:
                resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer,
            eiendomMatrikkelinformasjonBolignummer: resourceBindings?.eiendomMatrikkelinformasjonBolignummer,
            eiendomMatrikkelinformasjonBygningsnummer: resourceBindings?.eiendomMatrikkelinformasjonBygningsnummer,
            eier: resourceBindings?.eier,
            eierNavn: resourceBindings?.eierNavn,
            eierTelefonnummer: resourceBindings?.eierTelefonnummer,
            eierEpost: resourceBindings?.eierEpost,
            eierAdresse: resourceBindings?.eierAdresse,
            responsNabovarselSendtVia: resourceBindings?.responsNabovarselSendtVia,
            responsMerknadMottattDato: resourceBindings?.responsMerknadMottattDato,
            responsErMerknadEllerSamtykkeMottatt: resourceBindings?.responsErMerknadEllerSamtykkeMottatt,
            responsErMerknadMottatt: resourceBindings?.responsErMerknadMottatt,
            responsErSamtykkeMottatt: resourceBindings?.responsErSamtykkeMottatt
        };
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.naboGjenboerEiendom?.title),
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
     * Retrieves validation messages based on the provided resource bindings.
     *
     * @param {Object} resourceBindings - An object containing resource binding keys.
     * @returns {Array|string|boolean} The result of the validation, which may be an array of messages, a string, or a boolean indicating missing resources.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Extracts and transforms form data into a list of NaboGjenboerEiendom instances.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {NaboGjenboerEiendom[]} An array of NaboGjenboerEiendom objects created from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const naboGjenboerEiendomList = data?.map((item) => {
            return new NaboGjenboerEiendom(item);
        });
        return naboGjenboerEiendomList;
    }

    /**
     * Generates a set of resource binding objects for various property fields, using provided props for overrides.
     * Each binding contains localized resource keys for titles, empty field texts, and other display strings,
     * with fallbacks to default resource keys if not specified in props.
     *
     * @param {Object} props - The properties object containing optional resourceBindings and display flags.
     * @param {Object} [props.resourceBindings] - Optional overrides for resource binding values.
     * @param {boolean|string} [props.hideTitle] - If true, omits the main title resource binding.
     * @param {boolean|string} [props.hideIfEmpty] - If true, omits the empty field text for the main resource binding.
     * @returns {Object} An object mapping resource binding keys to their configuration objects.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            eiendomMatrikkelinformasjon: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjon?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
            },
            eiendomMatrikkelinformasjonAdresse: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonAdresse?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.title",
                emptyFieldText:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonAdresse?.emptyFieldText ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.emptyFieldText"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.gaardsnummer.title",
                emptyFieldText:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer?.emptyFieldText ||
                    "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.bruksnummer.title",
                emptyFieldText:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer?.emptyFieldText ||
                    "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.seksjonsnummer.title",
                emptyFieldText:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer?.emptyFieldText ||
                    "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.festenummer.title",
                emptyFieldText:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer?.emptyFieldText ||
                    "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonBolignummer: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonBolignummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bolignummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomMatrikkelinformasjonBolignummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomMatrikkelinformasjonBygningsnummer: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonBygningsnummer?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bygningsnummer.title",
                emptyFieldText:
                    props?.resourceBindings?.eiendomMatrikkelinformasjonBygningsnummer?.emptyFieldText || "resource.emptyFieldText.default"
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
            responsNabovarselSendt: {
                title: props?.resourceBindings?.responsNabovarselSendt?.title || "resource.respons.nabovarselSendt.title",
                emptyFieldText: props?.resourceBindings?.responsNabovarselSendt?.emptyFieldText || "resource.emptyFieldText.default"
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
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.naboGjenboerEiendom = {
                title: props?.resourceBindings?.title || "resource.naboGjenboer.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.naboGjenboerEiendom = {
                ...resourceBindings.naboGjenboerEiendom,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
