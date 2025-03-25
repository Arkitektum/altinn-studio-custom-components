import Kode from "./Kode.js";

export default class DispensasjonBeskrivelse {
    constructor(props) {
        this.dispensasjonTittel = props?.dispensasjonTittel && new Kode(props.dispensasjonTittel);
        this.inngangsbeskrivelse = props?.inngangsbeskrivelse && new Kode(props.inngangsbeskrivelse);
        this.annenInngangsbeskrivelse = props?.annenInngangsbeskrivelse;
        this.beskrivelse = props?.beskrivelse;
    }
}
