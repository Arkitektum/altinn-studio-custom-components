import type { BegrunnelseProps } from "../data-classes/Begrunnelse.ts";
import type { EiendomByggestedProps } from "../data-classes/EiendomByggested.ts";
import type { GenerelleVilkaarProps } from "../data-classes/GenerelleVilkaar.ts";
import type { KodeProps } from "../data-classes/Kode.ts";
import type { KommunensSaksnummerProps } from "../data-classes/KommunensSaksnummer.ts";
import type { MetadataProps } from "../data-classes/Metadata.ts";
import type { NasjonalArealplanIdProps } from "../data-classes/NasjonalArealplanId.ts";
import type { PartProps } from "../data-classes/Part.ts";
import type { StedfestingProps } from "../data-classes/Stedfesting.ts";
import type { VarighetProps } from "../data-classes/Varighet.ts";
// Classes
import Begrunnelse from "../data-classes/Begrunnelse.ts";
import EiendomByggested from "../data-classes/EiendomByggested.ts";
import Kode from "../data-classes/Kode.ts";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.ts";
import Metadata from "../data-classes/Metadata.ts";
import NasjonalArealplanId from "../data-classes/NasjonalArealplanId.ts";
import Part from "../data-classes/Part.ts";
import Stedfesting from "../data-classes/Stedfesting.ts";
import Varighet from "../data-classes/Varighet.ts";

// Global functions
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/** What the form data holds for the tiltakstyper of a Dispensasjon, before the codes are read into the class. */
export interface DispensasjonTiltakstyperProps {
    kode?: KodeProps[] | null;
    [key: string]: unknown;
}

/** The tiltakstyper once read, which is the codes and nothing else. */
export interface DispensasjonTiltakstyper {
    /** Null when the form data named the tiltakstyper but listed no codes under it. */
    kode: Kode[] | null;
}

/** What the form data holds for a Dispensasjon, before it is read into the class. */
export interface DispensasjonProps {
    begrunnelse?: BegrunnelseProps | null;
    bestemmelsestype?: KodeProps | null;
    dispensasjonsbeskrivelse?: string | null;
    dispensasjonsreferanse?: string | null;
    dispensasjonstema?: KodeProps | null;
    eiendomByggested?: EiendomByggestedProps | null;
    /** Passed through untouched, so what it holds is whatever the model held. */
    generelleVilkaar?: GenerelleVilkaarProps | null;
    kommunensSaksnummer?: KommunensSaksnummerProps | null;
    metadata?: MetadataProps | null;
    nasjonalArealplanId?: NasjonalArealplanIdProps | null;
    paragrafnummer?: string | null;
    plannavn?: string | null;
    stedfesting?: StedfestingProps | null;
    tiltakshaver?: PartProps | null;
    varighet?: VarighetProps | null;
    tiltakstyper?: DispensasjonTiltakstyperProps | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Dispensasjon.
 * @class
 */
export default class Dispensasjon {
    declare begrunnelse: Begrunnelse | undefined | null;
    declare bestemmelsestype: Kode | undefined | null;
    declare dispensasjonsbeskrivelse?: string | null;
    declare dispensasjonsreferanse?: string | null;
    declare dispensasjonstema: Kode | undefined | null;
    declare eiendomByggested: EiendomByggested | undefined | null;
    declare generelleVilkaar?: GenerelleVilkaarProps | null;
    declare kommunensSaksnummer: KommunensSaksnummer | undefined | null;
    declare metadata: Metadata | undefined | null;
    declare nasjonalArealplanId: NasjonalArealplanId | undefined | null;
    declare paragrafnummer?: string | null;
    declare plannavn?: string | null;
    declare stedfesting: Stedfesting | undefined | null;
    declare tiltakshaver: Part | undefined | null;
    declare varighet: Varighet | undefined | null;
    /** Only set when the form data named one, which is what lets a caller tell an absent one from an empty one. */
    declare tiltakstyper?: DispensasjonTiltakstyper;

    /**
     * Creates an instance of Dispensasjon.
     * @param {Object} props - The properties object.
     * @param {Object} [props.tiltakstyper] - The tiltakstyper object containing type information.
     * @param {Object} [props.begrunnelse] - The begrunnelse object containing justification information.
     * @param {Object} [props.bestemmelsestype] - The bestemmelsestype object containing type information.
     * @param {string} [props.dispensasjonsbeskrivelse] - The dispensasjonsbeskrivelse string containing the description of the exemption.
     * @param {string} [props.dispensasjonsreferanse] - The dispensasjonsreferanse string containing the reference for the exemption.
     * @param {Object} [props.dispensasjonstema] - The dispensasjonstema object containing theme information.
     * @param {Object} [props.eiendomByggested] - The eiendomByggested object containing property and construction site information.
     * @param {Array|string|boolean} [props.generelleVilkaar] - The generelleVilkaar array or string containing general conditions for the exemption.
     * @param {Object} [props.kommunensSaksnummer] - The kommunensSaksnummer object containing the municipality's case number information.
     * @param {Object} [props.metadata] - The metadata object containing metadata information.
     * @param {Object} [props.nasjonalArealplanId] - The nasjonalArealplanId object containing national area plan identification information.
     * @param {string} [props.paragrafnummer] - The paragrafnummer string containing the paragraph number related to the exemption.
     * @param {string} [props.plannavn] - The plannavn string containing the name of the plan related to the exemption.
     * @param {Object} [props.stedfesting] - The stedfesting object containing geolocation information.
     * @param {Object} [props.tiltakshaver] - The tiltakshaver object containing information about the party responsible for the measure.
     * @param {Object} [props.varighet] - The varighet object containing duration information for the exemption.
     */
    constructor(props?: DispensasjonProps) {
        const tiltakstyper = props ? this.getTiltakstyperFromProps(props) : null;
        this.begrunnelse = props?.begrunnelse && new Begrunnelse(props.begrunnelse);
        this.bestemmelsestype = props?.bestemmelsestype && new Kode(props.bestemmelsestype);
        this.dispensasjonsbeskrivelse = props?.dispensasjonsbeskrivelse;
        this.dispensasjonsreferanse = props?.dispensasjonsreferanse;
        this.dispensasjonstema = props?.dispensasjonstema && new Kode(props.dispensasjonstema);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.generelleVilkaar = props?.generelleVilkaar;
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.nasjonalArealplanId = props?.nasjonalArealplanId && new NasjonalArealplanId(props.nasjonalArealplanId);
        this.paragrafnummer = props?.paragrafnummer;
        this.plannavn = props?.plannavn;
        this.stedfesting = props?.stedfesting && new Stedfesting(props.stedfesting);
        this.tiltakshaver = props?.tiltakshaver && new Part(props.tiltakshaver);
        this.varighet = props?.varighet && new Varighet(props.varighet);

        if (tiltakstyper) {
            this.tiltakstyper = tiltakstyper;
        }
    }

    /**
     * Extracts the type information from the provided properties.
     * @param {Object} props - The properties object.
     * @param {Object} [props.tiltakstyper] - The tiltakstyper object containing type information.
     * @param {Array} [props.tiltakstyper.kode] - An array of type codes.
     * @returns {Object|null} An object containing the extracted type information, or null if not available.
     */
    getTiltakstyperFromProps(props?: DispensasjonProps): DispensasjonTiltakstyper | null {
        if (props && hasValue(props?.tiltakstyper)) {
            return {
                kode: this.getKodeFromType(props.tiltakstyper)
            };
        }
        return null;
    }

    /**
     * Converts the provided type object into an array of Kode instances.
     * @param {Object} type - The type object containing type information.
     * @param {Array} [type.kode] - An array of type codes.
     * @returns {Array|null} An array of Kode instances, or null if no valid codes are found.
     */
    getKodeFromType(type?: DispensasjonTiltakstyperProps | null): Kode[] | null {
        if (Array.isArray(type?.kode) && type?.kode?.length) {
            return type?.kode?.map((item) => {
                return new Kode(item);
            });
        }
        return null;
    }
}
