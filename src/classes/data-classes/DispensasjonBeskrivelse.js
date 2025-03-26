import Kode from "./Kode.js";
/**
 * Class representing a DispensasjonBeskrivelse.
 * @class
 */
export default class DispensasjonBeskrivelse {
    /**
     * Constructs an instance of the DispensasjonBeskrivelse class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.dispensasjonTittel] - The title of the dispensation, represented as a Kode instance.
     * @param {Object} [props.inngangsbeskrivelse] - The description of the entrance, represented as a Kode instance.
     * @param {string} [props.annenInngangsbeskrivelse] - An alternative description of the entrance.
     * @param {string} [props.beskrivelse] - A general description.
     */
    constructor(props) {
        this.dispensasjonTittel = props?.dispensasjonTittel && new Kode(props.dispensasjonTittel);
        this.inngangsbeskrivelse = props?.inngangsbeskrivelse && new Kode(props.inngangsbeskrivelse);
        this.annenInngangsbeskrivelse = props?.annenInngangsbeskrivelse;
        this.beskrivelse = props?.beskrivelse;
    }
}
