// Classes
import EiendomByggested from "./EiendomByggested.js";
import KommunensSaksnummer from "./KommunensSaksnummer.js";
import Metadata from "./Metadata.js";
import Part from "./Part.js";

export default class Gjennomfoeringsplan {
    constructor(props) {
        this.ansvarligSoeker = props?.ansvarligSoeker && new Part(props.ansvarligSoeker);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.gjennomfoeringsplan = props?.gjennomfoeringsplan;
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.versjon = props?.versjon;
    }
}
