// Classes
import Kode from "./Kode.js";


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
    constructor(props) {
        this.harTinglystErklaering = props?.harTinglystErklaering;
        this.krysserAvloepAnnensGrunn = props?.krysserAvloepAnnensGrunn;
        this.tilknytningstype = props?.tilknytningstype ? new Kode(props.tilknytningstype) : undefined;
        this.skalInstallereVannklosett = props?.skalInstallereVannklosett;
        this.harUtslippstillatelse = props?.harUtslippstillatelse;
    }
}
