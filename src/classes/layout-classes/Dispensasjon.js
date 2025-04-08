// Classes
import Begrunnelse from "../data-classes/Begrunnelse.js";
import DispensasjonBeskrivelse from "../data-classes/DispensasjonBeskrivelse.js";
import DispensasjonFra from "../data-classes/DispensasjonFra.js";
import EiendomByggested from "../data-classes/EiendomByggested.js";
import Kode from "../data-classes/Kode.js";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.js";
import Metadata from "../data-classes/Metadata.js";
import Part from "../data-classes/Part.js";
import Stedfesting from "../data-classes/Stedfesting.js";
import Varighet from "../data-classes/Varighet.js";

/**
 * Class representing a Dispensasjon.
 * @class
 */
export default class Dispensasjon {
    /**
     * Constructs a new instance of the Dispensasjon class.
     *
     * @param {Object} props - The properties to initialize the Dispensasjon instance.
     * @param {DispensasjonBeskrivelse} [props.dispensasjonBeskrivelse] - The description of the dispensasjon.
     * @param {string} [props.dispensasjonReferanse] - The reference for the dispensasjon.
     * @param {Kode} [props.soeknadstype] - The type of application.
     * @param {KommunensSaksnummer} [props.kommunensSaksnummer] - The municipality's case number.
     * @param {Metadata} [props.metadata] - Metadata associated with the dispensasjon.
     * @param {EiendomByggested} [props.eiendomByggested] - The property or construction site information.
     * @param {Part} [props.tiltakshaver] - The party responsible for the tiltak (measure).
     * @param {DispensasjonFra} [props.dispensasjonFra] - Information about what the dispensasjon is from.
     * @param {Stedfesting} [props.stedfesting] - Geographical location information.
     * @param {Varighet} [props.varighet] - The duration of the dispensasjon.
     * @param {Begrunnelse} [props.begrunnelse] - The justification for the dispensasjon.
     * @param {string} [props.generelleVilkaar] - General conditions for the dispensasjon.
     */
    constructor(props) {
        this.dispensasjonBeskrivelse = props?.dispensasjonBeskrivelse && new DispensasjonBeskrivelse(props.dispensasjonBeskrivelse);
        this.dispensasjonReferanse = props?.dispensasjonReferanse;
        this.soeknadstype = props?.soeknadstype && new Kode(props.soeknadstype);
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.tiltakshaver = props?.tiltakshaver && new Part(props.tiltakshaver);
        this.dispensasjonFra = props?.dispensasjonFra && new DispensasjonFra(props.dispensasjonFra);
        this.stedfesting = props?.stedfesting && new Stedfesting(props.stedfesting);
        this.varighet = props?.varighet && new Varighet(props.varighet);
        this.begrunnelse = props?.begrunnelse && new Begrunnelse(props.begrunnelse);
        this.generelleVilkaar = props?.generelleVilkaar;
    }
}
