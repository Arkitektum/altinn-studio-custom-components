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
        const resourceBindings = this.getResourceBindings();

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
     * Returns an object mapping resource binding keys to their corresponding resource titles and, where applicable, additional properties such as `trueText`.
     *
     * @returns {Object} An object where each key represents a resource binding and the value is an object containing resource title strings and optional properties.
     */
    getResourceBindings() {
        return {
            dispensasjonsreferanse: {
                title: "resource.dispensasjon.dispensasjonsreferanse.title"
            },
            metadataFtbId: {
                title: "resource.metadata.ftbId.title"
            },
            kommunensSaksnummer: {
                title: "resource.kommunensSaksnummer.title"
            },
            soeknadGjelderHeader: {
                title: "resource.soeknadGjelder.title"
            },
            tiltakstyperHeader: {
                title: "resource.tiltakstyper.type.header"
            },
            tiltakstyperKode: {
                title: "resource.tiltakstyper.type.kode.title"
            },
            tiltakshaverAdresse: {
                title: "resource.eiendom.adresse.title"
            },
            dispensasjonsbeskrivelse: {
                title: "resource.dispensasjonsbeskrivelse.title"
            },
            dispensasjonFraHeader: {
                title: "resource.dispensasjonFra.header"
            },
            plannavn: {
                title: "resource.navn.title"
            },
            nasjonalArealplanIdPlanIdentifikasjon: {
                title: "resource.dispensasjonFra.nasjonalArealplanId.planidentifikasjon.title"
            },
            bestemmelserType: {
                title: "resource.dispensasjonFra.bestemmelserType.title"
            },
            paragrafnummer: {
                title: "resource.planbestemmelse.title"
            },
            stedfestingHeader: {
                title: "resource.stedfesting.header"
            },
            stedfestingPosisjonKoordinatsystem: {
                title: "resource.stedfesting.posisjon.koordinatsystem.title"
            },
            stedfestingPosisjonKoordinater: {
                title: "resource.stedfesting.posisjon.koordinater.title"
            },
            stedfestingVertikalnivaa: {
                title: "resource.stedfesting.vertikalnivaa.title"
            },
            varighetHeader: {
                title: "resource.varighet.header"
            },
            varighetOenskesVarigDispensasjon: {
                trueText: "resource.varighet.oenskesVarigDispensasjon.true.title"
            },
            varighetOensketVarighetTil: {
                title: "resource.varighet.oensketVarighetTil.title"
            },
            begrunnelseHeader: {
                title: "resource.begrunnelse.header"
            },
            begrunnelseHensynBakBestemmelsen: {
                title: "resource.begrunnelse.hensynBakBestemmelsen.title"
            },
            begrunnelseVurderingHensynBakBestemmelsen: {
                title: "resource.begrunnelse.vurderingHensynBakBestemmelsen.title"
            },
            begrunnelseVurderingHensynOverordnet: {
                title: "resource.begrunnelse.vurderingHensynOverordnet.title"
            },
            begrunnelseFordeler: {
                title: "resource.begrunnelse.fordeler.title"
            },
            begrunnelseUlemper: {
                title: "resource.begrunnelse.ulemper.title"
            },
            begrunnelseSamletBegrunnelse: {
                title: "resource.begrunnelse.samletBegrunnelse.title"
            },
            generelleVilkaarNorskSvenskDansk: {
                title: "resource.generelleVilkaar.norskSvenskDansk.header",
                trueText: "resource.generelleVilkaar.norskSvenskDansk.true.title"
            }
        };
    }
}
