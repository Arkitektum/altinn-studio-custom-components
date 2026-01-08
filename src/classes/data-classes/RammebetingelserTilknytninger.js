// Classes
import Adkomst from "./Adkomst.js";
import Avloep from "./Avloep.js";
import Overvann from "./Overvann.js";
import Vannforsyning from "./Vannforsyning.js";

/**
 * Represents the connections for framework conditions.
 *
 * @class
 * @param {Object} props - The properties to initialize the connections.
 * @param {Object} [props.adkomst] - The access connection properties.
 * @param {Object} [props.avloep] - The drainage connection properties.
 * @param {Object} [props.vannforsyning] - The water supply connection properties.
 *
 * @property {Adkomst} adkomst - Instance of Adkomst if provided in props.
 * @property {Avloep} avloep - Instance of Avloep if provided in props.
 * @property {Overvann} overvann - Instance of Overvann if props.avloep is provided.
 * @property {Vannforsyning} vannforsyning - Instance of Vannforsyning if provided in props.
 */
export default class RammebetingelserTilknytninger {
    constructor(props) {
        this.adkomst = props?.adkomst && new Adkomst(props.adkomst);
        this.avloep = props?.avloep && new Avloep(props.avloep);
        this.overvann = props?.avloep && new Overvann(props.avloep);
        this.vannforsyning = props?.vannforsyning && new Vannforsyning(props.vannforsyning);
    }
}
