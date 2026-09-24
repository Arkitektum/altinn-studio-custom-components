import type { KodeProps } from "./Kode.ts";
// Classes
import FaseSamsvarKontrollList from "../system-classes/data-classes/FaseSamsvarKontrollList.js";
import Kode from "./Kode.ts";

/** What the form data holds for a AnsvarsrettAnsvarsomraade, before it is read into the class. */
export interface AnsvarsrettAnsvarsomraadeProps {
    funksjon?: KodeProps | null;
    beskrivelseAvAnsvarsomraadet?: unknown;
    tiltaksklasse?: KodeProps | null;
    dekkesOmraadeAvSentralGodkjenning?: unknown;
    soeknadssystemetsReferanse?: unknown;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a responsibility area.
 * @class
 */
export default class AnsvarsrettAnsvarsomraade {
    declare funksjon: Kode | null | undefined;
    declare beskrivelseAvAnsvarsomraadet?: unknown;
    declare tiltaksklasse: Kode | null | undefined;
    declare dekkesOmraadeAvSentralGodkjenning?: unknown;
    declare faseSamsvarKontrollList: FaseSamsvarKontrollList | null | undefined;
    declare soeknadssystemetsReferanse?: unknown;

    constructor(props: AnsvarsrettAnsvarsomraadeProps, resourceBindings?: Record<string, unknown>) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.beskrivelseAvAnsvarsomraadet = props?.beskrivelseAvAnsvarsomraadet;
        this.tiltaksklasse = props?.tiltaksklasse && new Kode(props.tiltaksklasse);
        this.dekkesOmraadeAvSentralGodkjenning = props?.dekkesOmraadeAvSentralGodkjenning;
        this.faseSamsvarKontrollList = new FaseSamsvarKontrollList(props.faseSamsvarKontroll, resourceBindings);
        this.soeknadssystemetsReferanse = props?.soeknadssystemetsReferanse;
    }
}
