// Classes
import Begrunnelse from "../data-classes/Begrunnelse.js";
import EiendomByggested from "../data-classes/EiendomByggested.js";
import Kode from "../data-classes/Kode.js";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.js";
import Metadata from "../data-classes/Metadata.js";
import NasjonalArealplanId from "../data-classes/NasjonalArealplanId.js";
import Part from "../data-classes/Part.js";
import Stedfesting from "../data-classes/Stedfesting.js";
import Varighet from "../data-classes/Varighet.js";

// Global functions
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Class representing a Dispensasjon.
 * @class
 */
export default class Dispensasjon {
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
    constructor(props) {
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
    getTiltakstyperFromProps(props) {
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
    getKodeFromType(type) {
        if (Array.isArray(type?.kode) && type?.kode?.length) {
            return type?.kode?.map((item) => {
                return new Kode(item);
            });
        }
        return null;
    }
}
