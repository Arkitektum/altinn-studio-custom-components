// Classes
import CustomComponent from "../CustomComponent.js";
import GjenpartNabovarsel from "../../layout-classes/GjenpartNabovarsel.js";

// Global functions
import { getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGjenpartNabovarsel is a custom component class for handling "Gjenpart Nabovarsel" logic.
 * It extends the CustomComponent base class and provides methods for extracting form data,
 * managing resource bindings, and validating content.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {Object} [props.formData] - The form data used to initialize the component.
 * @param {Object} [props.resourceBindings] - Optional resource binding overrides for field labels and texts.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {boolean} validationMessages - Indicates if there are missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages present.
 * @property {Object} resourceBindings - The resource binding configurations for various fields.
 * @property {Object} resourceValues - The resource values for the component, including data or empty field text.
 */
export default class CustomGjenpartNabovarsel extends CustomComponent {
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
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data has content by delegating to the hasValue function.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, false otherwise.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Extracts form data from the provided props and creates a new GjenpartNabovarsel instance.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {Object} [props.formData] - The form data to be used for creating the GjenpartNabovarsel instance.
     * @returns {GjenpartNabovarsel} A new instance of GjenpartNabovarsel initialized with the form data.
     */
    getValueFromFormData(props) {
        const data = props?.formData;
        const gjenpartNabovarsel = new GjenpartNabovarsel(data);
        return gjenpartNabovarsel;
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {boolean} Returns true if there are missing text resources, otherwise false.
     */
    getValidationMessages(textResourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, textResourceBindings);
    }

    /**
     * Generates an object containing resource binding configurations for various fields,
     * using provided props or default resource keys if not specified.
     *
     * @param {Object} props - The properties object containing optional resourceBindings.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for field labels and texts.
     * @returns {Object} An object mapping field keys to their resource binding configurations,
     *                   each containing properties such as `title`, `description`, `emptyFieldText`, `trueText`, or `falseText`.
     */
    getResourceBindings(props) {
        return {
            gjenpartNabovarsel: {
                title: props?.resourceBindings?.gjenpartNabovarsel?.title || "resource.gjenpartNabovarsel.title",
                description: props?.resourceBindings?.gjenpartNabovarsel?.description || "resource.gjenpartNabovarsel.description"
            },
            naboGjenboerEiendom: {
                title: props?.resourceBindings?.naboGjenboerEiendom?.title || "resource.naboGjenboer.title"
            },
            soeknadGjelderHeader: {
                title: props?.resourceBindings?.soeknadGjelderHeader?.title || "resource.soeknadGjelder.title"
            },
            eiendomByggested: {
                title: props?.resourceBindings?.eiendomByggested?.title || "resource.eiendomByggested.eiendom.title"
            },
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
            },
            eiendomMatrikkelinformasjon: {
                title:
                    props?.resourceBindings?.eiendomMatrikkelinformasjon?.title ||
                    "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
            },
            detVarslesHervedOmHeader: {
                title: props?.resourceBindings?.detVarslesHervedOmHeader?.title || "resource.detVarslesHervedOm.title"
            },
            soeknadGjelderType: {
                title: props?.resourceBindings?.soeknadGjelderType?.title || "resource.soeknadGjelder.type.title",
                emptyFieldText: props?.resourceBindings?.soeknadGjelderType?.emptyFieldText || "resource.emptyFieldText.default"
            },
            soeknadGjelderBrukTiltaksformaal: {
                title: props?.resourceBindings?.soeknadGjelderBrukTiltaksformaal?.title || "resource.soeknadGjelder.bruk.tiltaksformaal.title",
                emptyFieldText: props?.resourceBindings?.soeknadGjelderBrukTiltaksformaal?.emptyFieldText || "resource.emptyFieldText.default"
            },
            soeknadGjelderBrukBeskrivPlanlagtFormaal: {
                title:
                    props?.resourceBindings?.soeknadGjelderBrukBeskrivPlanlagtFormaal?.title ||
                    "resource.soeknadGjelder.bruk.beskrivPlanlagtFormaal.title",
                emptyFieldText: props?.resourceBindings?.soeknadGjelderBrukBeskrivPlanlagtFormaal?.emptyFieldText || "resource.emptyFieldText.default"
            },
            planerGjeldendePlan: {
                title: props?.resourceBindings?.planerGjeldendePlan?.title || "resource.planer.gjeldendePlan.title"
            },
            planerGjeldendePlanNavn: {
                title: props?.resourceBindings?.planerGjeldendePlanNavn?.title || "resource.planer.gjeldendePlan.navn.title"
            },
            planerGjeldendePlanPlantype: {
                title: props?.resourceBindings?.planerGjeldendePlanPlantype?.title || "resource.planer.gjeldendePlan.plantype.title"
            },
            spoersmaalRettesTil: {
                title: props?.resourceBindings?.spoersmaalRettesTil?.title || "resource.spoersmaalRettesTil.title"
            },
            kontaktpersonForNabovarselet: {
                title: props?.resourceBindings?.kontaktpersonForNabovarselet?.title || "resource.kontaktpersonForNabovarselet.title",
                emptyFieldText: props?.resourceBindings?.kontaktpersonForNabovarselet?.emptyFieldText || "resource.emptyFieldText.default"
            },
            merknaderSendesTil: {
                title: props?.resourceBindings?.merknaderSendesTil?.title || "resource.merknaderSendesTil.title"
            },
            ansvarligSoeker: {
                title: props?.resourceBindings?.ansvarligSoeker?.title || "resource.ansvarligSoeker.title"
            },
            tiltakshaver: {
                title: props?.resourceBindings?.tiltakshaver?.title || "resource.tiltakshaver.title"
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
    }
}
