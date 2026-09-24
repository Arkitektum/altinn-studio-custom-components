import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Omraaderisiko, before it is read into the class. */
export interface OmraaderisikoProps {
    risikotype?: KodeProps | undefined;
    sikkerhetsklasse?: KodeProps | undefined;
}

/**
 * Represents an area risk with associated codes.
 *
 * @class Omraaderisiko
 * @param {Object} props - The properties to initialize the Omraaderisiko instance.
 * @param {Object} [props.risikotype] - The risk type code object.
 * @param {Object} [props.sikkerhetsklasse] - The security class code object.
 */
export default class Omraaderisiko {
    declare risikotype: Kode | undefined;
    declare sikkerhetsklasse: Kode | undefined;

    constructor(props?: OmraaderisikoProps) {
        this.risikotype = props?.risikotype && new Kode(props.risikotype);
        this.sikkerhetsklasse = props?.sikkerhetsklasse && new Kode(props.sikkerhetsklasse);
    }
}
