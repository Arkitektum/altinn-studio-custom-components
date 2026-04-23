// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";
import Dispensasjon from "../../layout-classes/Dispensasjon.js";

// Global functions
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import { getComponentResourceValue } from "../../../functions/helpers.js";

/**
 * CustomDispensasjon is a custom component class for handling "dispensasjon" (exemption) data and logic.
 * It extends the CustomComponent class and provides methods for:
 *   - Extracting and validating data from form input
 *   - Checking if the data is empty or matches specific types
 *   - Retrieving and mapping resource bindings for localization
 *   - Collecting validation messages based on missing text resources
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing form data and configuration.
 * @param {*} props.formData - The form data to be validated and used for instantiation.
 *
 * @property {boolean} isEmpty - Indicates if the data is empty.
 * @property {boolean} isPlanBestemmelseType - Indicates if the data matches a plan bestemmelse type.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Mapped resource binding keys for localization.
 * @property {Object} resourceValues - Values for resource bindings, including fallback for empty data.
 */
export default class CustomDispensasjon extends CustomComponent {
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
     * Checks if the provided data value contains content.
     *
     * @param {*} data - The value from the data to check.
     * @returns {boolean} Returns true if the value has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves a value from the provided form data and returns a new Dispensasjon instance if the data is valid.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {*} props.formData - The form data to be validated and used for instantiation.
     * @returns {Dispensasjon|boolean} A new Dispensasjon instance if form data is valid, otherwise false.
     */
    getValueFromFormData(props) {
        return hasValue(props?.formData) && new Dispensasjon(props.formData);
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
     * Retrieves and maps resource binding keys for localization based on provided properties.
     *
     * @param {Object} props - The properties object containing resource binding information.
     * @returns {Object} An object containing mapped resource binding keys for localization.
     */
    getResourceBindings(props) {
        return {
            dispensasjonsreferanse: {
                title: props?.resourceBindings?.dispensasjonsreferanse?.title || "resource.dispensasjon.dispensasjonsreferanse.title"
            },
            metadataFtbId: {
                title: props?.resourceBindings?.metadataFtbId?.title || "resource.metadata.ftbId.title"
            },
            kommunensSaksnummer: {
                title: props?.resourceBindings?.kommunensSaksnummer?.title || "resource.kommunensSaksnummer.title"
            },
            soeknadGjelderHeader: {
                title: props?.resourceBindings?.soeknadGjelderHeader?.title || "resource.soeknadGjelder.title"
            },
            eiendomByggested: {
                title: props?.resourceBindings?.eiendomByggested?.title || "resource.eiendomByggested.eiendom.title"
            },
            adresse: {
                title: props?.resourceBindings?.adresse?.title || "resource.adresse.title",
                emptyFieldText: props?.resourceBindings?.adresse?.emptyFieldText || "resource.emptyFieldText.address"
            },
            eiendomsidentifikasjonGaardsnummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.title || "resource.eiendom.gaardsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.gaardsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonBruksnummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.title || "resource.eiendom.bruksnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.bruksnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonSeksjonsnummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.title || "resource.eiendom.seksjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.seksjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonFestenummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.title || "resource.eiendom.festenummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjon?.festenummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bolignummer: {
                title: props?.resourceBindings?.bolignummer?.title || "resource.eiendom.bolignummer.title",
                emptyFieldText: props?.resourceBindings?.bolignummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bygningsnummer: {
                title: props?.resourceBindings?.bygningsnummer?.title || "resource.eiendom.bygningsnummer.title",
                emptyFieldText: props?.resourceBindings?.bygningsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakstyperHeader: {
                title: props?.resourceBindings?.tiltakstyperHeader?.title || "resource.tiltakstyper.type.header"
            },
            tiltakstyperKode: {
                title: props?.resourceBindings?.tiltakstyperKode?.title || "resource.tiltakstyper.type.kode.title"
            },
            tiltakshaver: {
                title: props?.resourceBindings?.tiltakshaver?.title || "resource.tiltakshaver.title"
            },
            tiltakshaverNavn: {
                title: props?.resourceBindings?.tiltakshaverNavn?.title || "resource.part.navn.title",
                emptyFieldText: props?.resourceBindings?.tiltakshaverNavn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakshaverTelefonnummer: {
                title: props?.resourceBindings?.tiltakshaverTelefonnummer?.title || "resource.part.telefonnummer.title",
                emptyFieldText: props?.resourceBindings?.tiltakshaverTelefonnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakshaverEpost: {
                title: props?.resourceBindings?.tiltakshaverEpost?.title || "resource.part.epost.title",
                emptyFieldText: props?.resourceBindings?.tiltakshaverEpost?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakshaverAdresse: {
                title: props?.resourceBindings?.tiltakshaverAdresse?.title || "resource.adresse.title"
            },

            tiltakshaverKontaktperson: {
                title: props?.resourceBindings?.tiltakshaverKontaktperson?.title || "resource.tiltakshaver.kontaktperson.title"
            },
            tiltakshaverKontaktpersonNavn: {
                title: props?.resourceBindings?.tiltakshaverKontaktpersonNavn?.title || "resource.part.navn.title",
                emptyFieldText: props?.resourceBindings?.tiltakshaverKontaktpersonNavn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakshaverKontaktpersonTelefonnummer: {
                title: props?.resourceBindings?.tiltakshaverKontaktpersonTelefonnummer?.title || "resource.part.telefonnummer.title",
                emptyFieldText: props?.resourceBindings?.tiltakshaverKontaktpersonTelefonnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakshaverKontaktpersonEpost: {
                title: props?.resourceBindings?.tiltakshaverKontaktpersonEpost?.title || "resource.part.epost.title",
                emptyFieldText: props?.resourceBindings?.tiltakshaverKontaktpersonEpost?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltakshaverKontaktpersonAdresse: {
                title: props?.resourceBindings?.tiltakshaverKontaktpersonAdresse?.title || "resource.adresse.title"
            },
            dispensasjonsbeskrivelse: {
                title: props?.resourceBindings?.dispensasjonsbeskrivelse?.title || "resource.dispensasjonsbeskrivelse.title"
            },
            dispensasjonFraHeader: {
                title: props?.resourceBindings?.dispensasjonFraHeader?.title || "resource.dispensasjonFra.header"
            },
            plannavn: {
                title: props?.resourceBindings?.plannavn?.title || "resource.navn.title"
            },
            nasjonalArealplanIdPlanIdentifikasjon: {
                title:
                    props?.resourceBindings?.nasjonalArealplanIdPlanIdentifikasjon?.title ||
                    "resource.dispensasjonFra.nasjonalArealplanId.planidentifikasjon.title"
            },
            bestemmelsestype: {
                title: props?.resourceBindings?.bestemmelsestype?.title || "resource.dispensasjonFra.bestemmelsestype.title"
            },
            paragrafnummer: {
                title: props?.resourceBindings?.paragrafnummer?.title || "resource.planbestemmelse.title"
            },
            stedfesting: {
                title: props?.resourceBindings?.stedfesting?.title || "resource.stedfesting.title"
            },
            stedfestingPosisjonKoordinatsystem: {
                title: props?.resourceBindings?.stedfestingPosisjonKoordinatsystem?.title || "resource.stedfesting.posisjon.koordinatsystem.title"
            },
            stedfestingPosisjonKoordinater: {
                title: props?.resourceBindings?.stedfestingPosisjonKoordinater?.title || "resource.stedfesting.posisjon.koordinater.title"
            },
            stedfestingVertikalnivaa: {
                title: props?.resourceBindings?.stedfestingVertikalnivaa?.title || "resource.stedfesting.vertikalnivaa.title"
            },
            varighet: {
                title: props?.resourceBindings?.varighet?.title || "resource.varighet.title"
            },
            varighetOenskesVarigDispensasjon: {
                trueText: props?.resourceBindings?.varighetOenskesVarigDispensasjon?.trueText || "resource.varighet.oenskesVarigDispensasjon.trueText"
            },
            varighetOensketVarighetTil: {
                title: props?.resourceBindings?.varighetOensketVarighetTil?.title || "resource.varighet.oensketVarighetTil.title"
            },
            begrunnelse: {
                title: props?.resourceBindings?.begrunnelse?.title || "resource.begrunnelse.title"
            },
            begrunnelseHensynBakBestemmelsen: {
                title: props?.resourceBindings?.begrunnelseHensynBakBestemmelsen?.title || "resource.begrunnelse.hensynBakBestemmelsen.title"
            },
            begrunnelseVurderingHensynBakBestemmelsen: {
                title:
                    props?.resourceBindings?.begrunnelseVurderingHensynBakBestemmelsen?.title ||
                    "resource.begrunnelse.vurderingHensynBakBestemmelsen.title"
            },
            begrunnelseVurderingHensynOverordnet: {
                title: props?.resourceBindings?.begrunnelseVurderingHensynOverordnet?.title || "resource.begrunnelse.vurderingHensynOverordnet.title"
            },
            begrunnelseFordeler: {
                title: props?.resourceBindings?.begrunnelseFordeler?.title || "resource.begrunnelse.fordeler.title"
            },
            begrunnelseUlemper: {
                title: props?.resourceBindings?.begrunnelseUlemper?.title || "resource.begrunnelse.ulemper.title"
            },
            begrunnelseSamletBegrunnelse: {
                title: props?.resourceBindings?.begrunnelseSamletBegrunnelse?.title || "resource.begrunnelse.samletBegrunnelse.title"
            },
            generelleVilkaarNorskSvenskDansk: {
                title: props?.resourceBindings?.generelleVilkaarNorskSvenskDansk?.title || "resource.generelleVilkaar.norskSvenskDansk.header",
                trueText:
                    props?.resourceBindings?.generelleVilkaarNorskSvenskDansk?.trueText || "resource.generelleVilkaar.norskSvenskDansk.true.title"
            }
        };
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return [
            "custom-feedbacklist-validation-messages",
            "custom-field-adresse",
            "custom-field-boolean-text",
            "custom-field-data",
            "custom-field-kommunens-saksnummer",
            "custom-header-text",
            "custom-list-data",
            "custom-paragraph-text",
            "custom-table-eiendom",
            "custom-table-part"
        ];
    }
}
