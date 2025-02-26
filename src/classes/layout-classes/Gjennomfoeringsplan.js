import EiendomByggested from "../EiendomByggested.js";
import KommunensSaksnummer from "../KommunensSaksnummer.js";
import Metadata from "../Metadata.js";

export default class Gjennomfoeringsplan {
    constructor(props) {
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.versjon = props?.versjon;
    }
}
