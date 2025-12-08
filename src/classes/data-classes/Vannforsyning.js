// Classes
import Kode from "./Kode.js";

/**
 * Represents a Vannforsyning (Water Supply) entity.
 *
 * @class
 * @param {Object} props - Properties to initialize the Vannforsyning instance.
 * @param {string} [props.beskrivelse] - Description of the water supply.
 * @param {boolean} [props.harTinglystErklaering] - Indicates if there is a registered declaration.
 * @param {boolean} [props.krysserVannforsyningAnnensGrunn] - Indicates if the water supply crosses another's property.
 * @param {Object} [props.tilknytningstype] - Type of connection, used to instantiate a Kode object.
 */
export default class Vannforsyning {
    constructor(props) {
        this.beskrivelse = props?.beskrivelse;
        this.harTinglystErklaering = props?.harTinglystErklaering;
        this.krysserVannforsyningAnnensGrunn = props?.krysserVannforsyningAnnensGrunn;
        this.tilknytningstype = props?.tilknytningstype ? new Kode(props.tilknytningstype) : undefined;
    }
}
