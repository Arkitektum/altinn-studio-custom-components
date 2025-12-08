// Classes
import Kode from "./Kode.js";

/**
 * Represents an Avloep (drainage) entity.
 * @class
 * @param {Object} props - Properties to initialize the Avloep instance.
 * @param {boolean} [props.harTinglystErklaering] - Indicates if there is a registered declaration.
 * @param {boolean} [props.krysserAvloepAnnensGrunn] - Indicates if the drainage crosses another's property.
 * @param {Object|string} [props.tilknytningstype] - The type of connection, used to instantiate a Kode object.
 */
export default class Avloep {
    constructor(props) {
        this.harTinglystErklaering = props?.harTinglystErklaering;
        this.krysserAvloepAnnensGrunn = props?.krysserAvloepAnnensGrunn;
        this.tilknytningstype = props?.tilknytningstype ? new Kode(props.tilknytningstype) : undefined;
    }
}
