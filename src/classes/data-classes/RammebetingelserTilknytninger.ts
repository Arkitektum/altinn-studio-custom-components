import type { AdkomstProps } from "./Adkomst.ts";
import type { AvloepProps } from "./Avloep.ts";
import type { OvervannProps } from "./Overvann.ts";
import type { VannforsyningProps } from "./Vannforsyning.ts";
// Classes
import Adkomst from "./Adkomst.ts";
import Avloep from "./Avloep.ts";
import Overvann from "./Overvann.ts";
import Vannforsyning from "./Vannforsyning.ts";

/** What the form data holds for a RammebetingelserTilknytninger, before it is read into the class. */
export interface RammebetingelserTilknytningerProps {
    adkomst?: AdkomstProps | undefined;
    avloep?: AvloepProps | undefined;
    overvann?: OvervannProps | undefined;
    vannforsyning?: VannforsyningProps | undefined;
}

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
    declare adkomst: Adkomst | undefined;
    declare avloep: Avloep | undefined;
    declare overvann: Overvann | undefined;
    declare vannforsyning: Vannforsyning | undefined;

    constructor(props?: RammebetingelserTilknytningerProps) {
        this.adkomst = props?.adkomst && new Adkomst(props.adkomst);
        this.avloep = props?.avloep && new Avloep(props.avloep);
        // Built from the avløp data on purpose: the surface water fields sit inside it in this model, and there
        // is no overvann of its own. The test "should only create avloep and overvann when only avloep is
        // provided" is what pins that.
        this.overvann = props?.avloep && new Overvann(props.avloep as unknown as OvervannProps);
        this.vannforsyning = props?.vannforsyning && new Vannforsyning(props.vannforsyning);
    }
}
