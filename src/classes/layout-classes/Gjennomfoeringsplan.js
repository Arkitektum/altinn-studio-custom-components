// Classes
import EiendomByggested from "../data-classes/EiendomByggested.js";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.js";
import Metadata from "../data-classes/Metadata.js";
import Part from "../data-classes/Part.js";

/**
 * Class representing a Gjennomfoeringsplan.
 * @class
 */
export default class Gjennomfoeringsplan {
    /**
     * Constructs a new Gjennomfoeringsplan instance.
     *
     * @param {Object} props - The properties to initialize the Gjennomfoeringsplan.
     * @param {Object} [props.ansvarligSoeker] - Data for the ansvarligSoeker property, used to instantiate a Part.
     * @param {Object} [props.eiendomByggested] - Data for the eiendomByggested property, used to instantiate an EiendomByggested.
     * @param {*} [props.gjennomfoeringsplan] - The gjennomfoeringsplan data.
     * @param {Object} [props.kommunensSaksnummer] - Data for the kommunensSaksnummer property, used to instantiate a KommunensSaksnummer.
     * @param {Object} [props.metadata] - Data for the metadata property, used to instantiate a Metadata.
     * @param {*} [props.versjon] - The version of the Gjennomfoeringsplan.
     */
    constructor(props) {
        this.ansvarligSoeker = props?.ansvarligSoeker && new Part(props.ansvarligSoeker);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.gjennomfoeringsplan = props?.gjennomfoeringsplan;
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.versjon = props?.versjon;
    }
}
