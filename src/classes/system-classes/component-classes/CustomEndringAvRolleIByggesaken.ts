import type { ComponentProps, DataModelBindingKeys, ResourceBindingGroup } from "../../../types.ts";
// Classes
import CustomComponent from "../CustomComponent.ts";
import EndringAvRolleIByggesaken from "../../layout-classes/EndringAvRolleIByggesaken.ts";

// Global functions
import { getComponentResourceValue } from "../../../functions/helpers.ts";
import { hasValidationMessages } from "../../../functions/validations.ts";

/**
 * CustomEndringAvRolleIByggesaken is a custom component class for handling "Endring av rolle i byggesaken" logic.
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
export default class CustomEndringAvRolleIByggesaken extends CustomComponent {
    static dataModelBindingKeys: DataModelBindingKeys = {
        expected: ["eiendomByggested", "endringMeldtAv", "gjelderFraDato", "kommunensSaksnummer", "rolleendringer", "soeknadGjelder"],
        deprecated: {}
    };

    declare resourceBindings: Record<string, ResourceBindingGroup | undefined>;
    declare resourceValues: { data?: EndringAvRolleIByggesaken | string };

    constructor(props: ComponentProps) {
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
     * Extracts form data from the provided props and creates a new EndringAvRolleIByggesaken instance.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {Object} [props.formData] - The form data to be used for creating the EndringAvRolleIByggesaken instance.
     * @returns {EndringAvRolleIByggesaken} A new instance of EndringAvRolleIByggesaken initialized with the form data.
     */
    getValueFromFormData(props: ComponentProps): EndringAvRolleIByggesaken {
        return new EndringAvRolleIByggesaken(props?.formData);
    }

    /**
     * Generates an object containing resource binding configurations for various fields,
     * using provided props or default resource keys if not specified.
     *
     * @param {Object} props - The properties object containing optional resourceBindings.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for field labels and texts.
     * @returns {Object} An object mapping field keys to their resource binding configurations.
     */
    getResourceBindings(props?: ComponentProps) {
        return {
            endringAvRolleIByggesaken: {
                title: props?.resourceBindings?.endringAvRolleIByggesaken?.title || "resource.endringAvRolleIByggesaken.title"
            },
            kommunensSaksnummer: {
                title: props?.resourceBindings?.kommunensSaksnummer?.title || "resource.kommunensSaksnummer.title"
            },
            gjelderFraDato: {
                title: props?.resourceBindings?.gjelderFraDato?.title || "resource.endringAvRolleIByggesaken.gjelderFraDato.title"
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
                title: props?.resourceBindings?.eiendomsidentifikasjonGaardsnummer?.title || "resource.eiendom.gaardsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjonGaardsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonBruksnummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjonBruksnummer?.title || "resource.eiendom.bruksnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjonBruksnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonSeksjonsnummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjonSeksjonsnummer?.title || "resource.eiendom.seksjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjonSeksjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            eiendomsidentifikasjonFestenummer: {
                title: props?.resourceBindings?.eiendomsidentifikasjonFestenummer?.title || "resource.eiendom.festenummer.title",
                emptyFieldText: props?.resourceBindings?.eiendomsidentifikasjonFestenummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bolignummer: {
                title: props?.resourceBindings?.bolignummer?.title || "resource.eiendom.bolignummer.title",
                emptyFieldText: props?.resourceBindings?.bolignummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            bygningsnummer: {
                title: props?.resourceBindings?.bygningsnummer?.title || "resource.eiendom.bygningsnummer.title",
                emptyFieldText: props?.resourceBindings?.bygningsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            soeknadGjelderType: {
                title: props?.resourceBindings?.soeknadGjelderType?.title || "resource.soeknadGjelder.type.kode.kodebeskrivelse",
                emptyFieldText: props?.resourceBindings?.soeknadGjelderType?.emptyFieldText || "resource.emptyFieldText.default"
            },
            soeknadGjelderBrukTiltaksformaal: {
                title:
                    props?.resourceBindings?.soeknadGjelderBrukTiltaksformaal?.title ||
                    "resource.soeknadGjelder.bruk.tiltaksformaal.kode.kodebeskrivelse",
                emptyFieldText: props?.resourceBindings?.soeknadGjelderBrukTiltaksformaal?.emptyFieldText || "resource.emptyFieldText.default"
            },
            rolleendringer: {
                title: props?.resourceBindings?.rolleendringer?.title || "resource.rolleendringer.title"
            },
            rolleendringAktoertype: {
                title: props?.resourceBindings?.rolleendringAktoertype?.title || "resource.rolleendringer.rolleendring.aktoertype.title",
                emptyFieldText: props?.resourceBindings?.rolleendringAktoertype?.emptyFieldText || "resource.emptyFieldText.default"
            },
            rolleendringAktoerendring: {
                title: props?.resourceBindings?.rolleendringAktoerendring?.title || "resource.rolleendringer.rolleendring.aktoerendring.title",
                emptyFieldText: props?.resourceBindings?.rolleendringAktoerendring?.emptyFieldText || "resource.emptyFieldText.default"
            },
            rolleendringAktoerNavn: {
                title: props?.resourceBindings?.rolleendringAktoerNavn?.title || "resource.navn.title",
                emptyFieldText: props?.resourceBindings?.rolleendringAktoerNavn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            rolleendringAktoerOrganisasjonsnummer: {
                title: props?.resourceBindings?.rolleendringAktoerOrganisasjonsnummer?.title || "resource.organisasjonsnummer.title",
                emptyFieldText: props?.resourceBindings?.rolleendringAktoerOrganisasjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            rolleendringErRolleendringErklaert: {
                title:
                    props?.resourceBindings?.rolleendringErRolleendringErklaert?.title ||
                    "resource.rolleendringer.rolleendring.erRolleendringErklaert.title",
                trueText: props?.resourceBindings?.rolleendringErRolleendringErklaert?.trueText || "resource.trueText.default",
                falseText: props?.resourceBindings?.rolleendringErRolleendringErklaert?.falseText || "resource.falseText.default"
            },
            endringMeldtAv: {
                title: props?.resourceBindings?.endringMeldtAv?.title || "resource.endringMeldtAv.title"
            },
            endringMeldtAvNavn: {
                title: props?.resourceBindings?.endringMeldtAvNavn?.title || "resource.navn.title",
                emptyFieldText: props?.resourceBindings?.endringMeldtAvNavn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            endringMeldtAvTelefonnummer: {
                title: props?.resourceBindings?.endringMeldtAvTelefonnummer?.title || "resource.telefonnummer.title",
                emptyFieldText: props?.resourceBindings?.endringMeldtAvTelefonnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            endringMeldtAvEpost: {
                title: props?.resourceBindings?.endringMeldtAvEpost?.title || "resource.epostadresse.title",
                emptyFieldText: props?.resourceBindings?.endringMeldtAvEpost?.emptyFieldText || "resource.emptyFieldText.default"
            },
            endringMeldtAvAdresse: {
                title: props?.resourceBindings?.endringMeldtAvAdresse?.title || "resource.adresse.title"
            },
            endringMeldtAvKontaktperson: {
                title: props?.resourceBindings?.endringMeldtAvKontaktperson?.title || "resource.kontaktperson.title"
            },
            endringMeldtAvKontaktpersonNavn: {
                title: props?.resourceBindings?.endringMeldtAvKontaktpersonNavn?.title || "resource.navn.title",
                emptyFieldText: props?.resourceBindings?.endringMeldtAvKontaktpersonNavn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            endringMeldtAvKontaktpersonTelefonnummer: {
                title: props?.resourceBindings?.endringMeldtAvKontaktpersonTelefonnummer?.title || "resource.telefonnummer.title",
                emptyFieldText: props?.resourceBindings?.endringMeldtAvKontaktpersonTelefonnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            endringMeldtAvKontaktpersonEpost: {
                title: props?.resourceBindings?.endringMeldtAvKontaktpersonEpost?.title || "resource.epostadresse.title",
                emptyFieldText: props?.resourceBindings?.endringMeldtAvKontaktpersonEpost?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage(): string[] {
        return [
            "custom-feedbacklist-validation-messages",
            "custom-field-adresse",
            "custom-field-boolean-text",
            "custom-field-data",
            "custom-field-kommunens-saksnummer",
            "custom-header-text",
            "custom-list-data",
            "custom-table-data",
            "custom-table-eiendom",
            "custom-table-part"
        ];
    }
}
