// Classes
import Kode from "./Kode.js";

/**
 * Represents an area risk with associated codes.
 *
 * @class Omraaderisiko
 * @param {Object} props - The properties to initialize the Omraaderisiko instance.
 * @param {Object} [props.kode] - The code object for the area risk.
 * @param {Object} [props.kodelisteNavn] - The code list name object for the area risk.
 */
export default class Omraaderisiko {
    constructor(props) {
        this.kode = props?.kode && new Kode(props.kode);
        this.kodelisteNavn = props?.kodelisteNavn && new Kode(props.kodelisteNavn);
    }
}
