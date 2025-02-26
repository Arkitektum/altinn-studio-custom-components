import Adresse from "./Adresse.js";
import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon.js";

export default class Eiendom {
    constructor(props) {
        this.adresse = props?.adresse && new Adresse(props.adresse);
        this.eiendomsidentifikasjon =
            props?.eiendomsidentifikasjon && new Eiendomsidentifikasjon(props.eiendomsidentifikasjon);
        this.bolignummer = props?.bolignummer;
        this.bygningsnummer = props?.bygningsnummer;
    }
}
