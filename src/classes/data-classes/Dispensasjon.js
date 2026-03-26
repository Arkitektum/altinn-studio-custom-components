import Kode from "./Kode";

/**
 * @typedef {Object} DispensasjonProps
 * @property {string} [dispensasjonReferanse] - The reference for the dispensation.
 * @property {Object} [dispensasjonKategori] - The category of the dispensation. Instance of Kode.
 * @property {Object} [dispensasjonTittel] - The title of the dispensation. Instance of Kode.
 * @property {Object} [bestemmelserType] - The type of provisions. Instance of Kode.
 */
export default class Dispensasjon {
    constructor(props) {
        this.dispensasjonReferanse = props?.dispensasjonReferanse;
        this.dispensasjonKategori = props?.dispensasjonKategori && new Kode(props.dispensasjonKategori);
        this.dispensasjonTittel = props?.dispensasjonTittel && new Kode(props.dispensasjonTittel);
        this.bestemmelserType = props?.bestemmelserType && new Kode(props.bestemmelserType);
    }
}
