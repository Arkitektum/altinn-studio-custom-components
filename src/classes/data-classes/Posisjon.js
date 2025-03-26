import Kode from "./Kode.js";
/**
 * Class representing a Posisjon.
 * @class
 */
export default class Posisjon {
    /**
     * Constructs a new instance of the Posisjon class.
     *
     * @param {Object} props - The properties to initialize the Posisjon instance.
     * @param {Object} [props.koordinatsystem] - The coordinate system, wrapped in a Kode instance if provided.
     * @param {string} [props.koordinater] - The coordinates associated with the position.
     * @param {Object} [props.vertikalnivaa] - The vertical level, wrapped in a Kode instance if provided.
     */
    constructor(props) {
        this.koordinatsystem = props?.koordinatsystem && new Kode(props.koordinatsystem);
        this.koordinater = props?.koordinater;
        this.vertikalnivaa = props?.vertikalnivaa && new Kode(props.vertikalnivaa);
    }
}
