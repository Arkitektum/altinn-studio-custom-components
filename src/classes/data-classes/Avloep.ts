import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";


/** What the form data holds for a Avloep, before it is read into the class. */
export interface AvloepProps {
    harTinglystErklaering?: boolean;
    krysserAvloepAnnensGrunn?: boolean;
    tilknytningstype?: KodeProps | undefined;
    skalInstallereVannklosett?: boolean;
    harUtslippstillatelse?: boolean;
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
    declare harTinglystErklaering?: boolean;
    declare krysserAvloepAnnensGrunn?: boolean;
    declare tilknytningstype: Kode | undefined;
    declare skalInstallereVannklosett?: boolean;
    declare harUtslippstillatelse?: boolean;

    constructor(props?: AvloepProps) {
        this.harTinglystErklaering = props?.harTinglystErklaering;
        this.krysserAvloepAnnensGrunn = props?.krysserAvloepAnnensGrunn;
        this.tilknytningstype = props?.tilknytningstype ? new Kode(props.tilknytningstype) : undefined;
        this.skalInstallereVannklosett = props?.skalInstallereVannklosett;
        this.harUtslippstillatelse = props?.harUtslippstillatelse;
    }
}
