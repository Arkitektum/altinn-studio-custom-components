import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";


/** What the form data holds for a Avloep, before it is read into the class. */
export interface AvloepProps {
    harTinglystErklaering?: boolean | null;
    krysserAvloepAnnensGrunn?: boolean | null;
    tilknytningstype?: KodeProps | undefined | null;
    skalInstallereVannklosett?: boolean | null;
    harUtslippstillatelse?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Avloep class represents a wastewater connection with various properties.
 * @param {Object} props - The properties for Avloep.
 * @param {boolean} [props.harTinglystErklaering] - Indicates if a registered declaration exists.
 * @param {boolean} [props.krysserAvloepAnnensGrunn] - Indicates if the wastewater crosses another's property.
 * @param {Object} [props.tilknytningstype] - The type of connection, wrapped in a Kode instance.
 * @param {boolean} [props.skalInstallereVannklosett] - Indicates if a flush toilet will be installed.
 * @param {boolean} [props.harUtslippstillatelse] - Indicates if a discharge permit exists.
 */
export default class Avloep {
    declare harTinglystErklaering?: boolean | null;
    declare krysserAvloepAnnensGrunn?: boolean | null;
    declare tilknytningstype: Kode | undefined | null;
    declare skalInstallereVannklosett?: boolean | null;
    declare harUtslippstillatelse?: boolean | null;

    constructor(props?: AvloepProps) {
        this.harTinglystErklaering = props?.harTinglystErklaering;
        this.krysserAvloepAnnensGrunn = props?.krysserAvloepAnnensGrunn;
        this.tilknytningstype = props?.tilknytningstype ? new Kode(props.tilknytningstype) : undefined;
        this.skalInstallereVannklosett = props?.skalInstallereVannklosett;
        this.harUtslippstillatelse = props?.harUtslippstillatelse;
    }
}
