import type { KodeProps } from "./Kode.ts";
import type { PartProps } from "./Part.ts";
// Classes
import Kode from "./Kode.ts";
import Part from "./Part.ts";
import PlanlagteSamsvarKontrollErklaeringerList from "../system-classes/data-classes/PlanlagteSamsvarKontrollErklaeringerList.js";

/** What the form data holds for a Ansvarsomraade, before it is read into the class. */
export interface AnsvarsomraadeProps {
    funksjon?: KodeProps | null;
    tiltaksklasse?: KodeProps | null;
    ansvarsomraade?: unknown;
    foretak?: PartProps | null;
    ansvarsomraadeStatus?: KodeProps | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a responsibility area.
 * @class
 */
export default class Ansvarsomraade {
    declare funksjon: Kode | null | undefined;
    declare tiltaksklasse: Kode | null | undefined;
    declare ansvarsomraade?: unknown;
    declare foretak: Part | null | undefined;
    declare planlagteSamsvarKontrollErklaeringerList: PlanlagteSamsvarKontrollErklaeringerList | null | undefined;
    declare ansvarsomraadeStatus: Kode | null | undefined;

    constructor(props?: AnsvarsomraadeProps, resourceBindings?: Record<string, unknown>) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.tiltaksklasse = props?.tiltaksklasse && new Kode(props.tiltaksklasse);
        this.ansvarsomraade = props?.ansvarsomraade;
        this.foretak = props?.foretak && new Part(props.foretak);
        this.planlagteSamsvarKontrollErklaeringerList = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        this.ansvarsomraadeStatus = props?.ansvarsomraadeStatus && new Kode(props.ansvarsomraadeStatus);
    }
}
