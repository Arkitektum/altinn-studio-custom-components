import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Vannforsyning, before it is read into the class. */
export interface VannforsyningProps {
    beskrivelse?: string | null;
    harTinglystErklaering?: boolean | null;
    krysserVannforsyningAnnensGrunn?: boolean | null;
    tilknytningstype?: KodeProps | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

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
    declare beskrivelse?: string | null;
    declare harTinglystErklaering?: boolean | null;
    declare krysserVannforsyningAnnensGrunn?: boolean | null;
    declare tilknytningstype: Kode | undefined | null;

    constructor(props?: VannforsyningProps) {
        this.beskrivelse = props?.beskrivelse;
        this.harTinglystErklaering = props?.harTinglystErklaering;
        this.krysserVannforsyningAnnensGrunn = props?.krysserVannforsyningAnnensGrunn;
        this.tilknytningstype = props?.tilknytningstype ? new Kode(props.tilknytningstype) : undefined;
    }
}
