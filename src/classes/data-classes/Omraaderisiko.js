// Classes
import Kode from "./Kode.js";

/**
 * Represents an area risk with associated codes.
 *
 * @class Omraaderisiko
 * @param {Object} props - The properties to initialize the Omraaderisiko instance.
 * @param {Object} [props.risikotype] - The risk type code object.
 * @param {Object} [props.sikkerhetsklasse] - The security class code object.
 */
export default class Omraaderisiko {
    constructor(props) {
        this.risikotype = props?.risikotype && new Kode(props.risikotype);
        this.sikkerhetsklasse = props?.sikkerhetsklasse && new Kode(props.sikkerhetsklasse);
    }
}
