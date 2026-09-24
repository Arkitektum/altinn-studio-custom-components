import Kode from "./Kode.ts";
import type { KodeProps } from "./Kode.ts";

/** What the form data holds for a Dispensasjon, before it is read into the class. */
export interface DispensasjonProps {
    dispensasjonReferanse?: unknown;
    dispensasjonKategori?: KodeProps | undefined;
    dispensasjonTittel?: KodeProps | undefined;
    bestemmelserType?: KodeProps | undefined;
}

/**
 * @typedef {Object} DispensasjonProps
 * @property {string} [dispensasjonReferanse] - The reference for the dispensation.
 * @property {Object} [dispensasjonKategori] - The category of the dispensation. Instance of Kode.
 * @property {Object} [dispensasjonTittel] - The title of the dispensation. Instance of Kode.
 * @property {Object} [bestemmelserType] - The type of provisions. Instance of Kode.
 */
export default class Dispensasjon {
    declare dispensasjonReferanse?: unknown;
    declare dispensasjonKategori: Kode | undefined;
    declare dispensasjonTittel: Kode | undefined;
    declare bestemmelserType: Kode | undefined;

    constructor(props?: DispensasjonProps) {
        this.dispensasjonReferanse = props?.dispensasjonReferanse;
        this.dispensasjonKategori = props?.dispensasjonKategori && new Kode(props.dispensasjonKategori);
        this.dispensasjonTittel = props?.dispensasjonTittel && new Kode(props.dispensasjonTittel);
        this.bestemmelserType = props?.bestemmelserType && new Kode(props.bestemmelserType);
    }
}
