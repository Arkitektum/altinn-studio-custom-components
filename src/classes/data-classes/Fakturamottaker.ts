import type { AdresseProps } from "./Adresse.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import Adresse from "./Adresse.ts";

/** What the form data holds for a Fakturamottaker, before it is read into the class. */
export interface FakturamottakerProps {
    navn?: string | null;
    adresse?: AdresseProps | null;
    organisasjonsnummer?: string | null;
    bestillerreferanse?: string | null;
    fakturareferanse?: string | null;
    prosjektnummer?: number | null;
    epost?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Fakturamottaker.
 * @class
 */
export default class Fakturamottaker {
    /**
     * Constructs a new instance of the Fakturamottaker class.
     *
     * @param {Object} props - The properties to initialize the Fakturamottaker instance.
     * @param {string} [props.navn] - The name of the invoice recipient.
     * @param {Object} [props.adresse] - The address object.
     * @param {string} [props.organisasjonsnummer] - The organization number.
     * @param {string} [props.bestillerreferanse] - The orderer's reference.
     * @param {string} [props.fakturareferanse] - The invoice reference.
     * @param {number} [props.prosjektnummer] - The project number.
     * @param {string} [props.epost] - The email address.
     */

    declare navn?: string | null;
    declare adresse?: Adresse | null;
    declare organisasjonsnummer?: string | null;
    declare bestillerreferanse?: string | null;
    declare fakturareferanse?: string | null;
    declare prosjektnummer?: number | null;
    declare epost?: string | null;

    constructor(props?: FakturamottakerProps) {
        const adresse = this.getAdresse(props);

        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
        this.bestillerreferanse = props?.bestillerreferanse;
        this.fakturareferanse = props?.fakturareferanse;
        this.prosjektnummer = props?.prosjektnummer;
        this.epost = props?.epost;

        if (adresse) {
            this.adresse = adresse;
        }
    }

    /**
     * Retrieves an Adresse instance if the provided props object contains a valid 'adresse' property.
     *
     * @param {Object} props - The properties object containing the 'adresse' field.
     * @param {any} props.adresse - The address data to be used for creating an Adresse instance.
     * @returns {Adresse|undefined} An instance of Adresse if 'adresse' is valid, otherwise undefined.
     */
    getAdresse(props?: FakturamottakerProps) {
        if (hasValue(props?.adresse)) {
            return new Adresse(props?.adresse);
        }
        return undefined;
    }
}
