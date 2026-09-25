import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Respons, before it is read into the class. */
export interface ResponsProps {
    erMerknadMottatt?: boolean | null;
    erSamtykkeMottatt?: boolean | null;
    nabovarselSendt?: string | null;
    nabovarselSendtVia?: KodeProps | undefined | null;
    samtykkeMottattDato?: string | null;
    merknadMottattDato?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Respons.
 * @class
 */
export default class Respons {
    declare erMerknadMottatt?: boolean | null;
    declare erSamtykkeMottatt?: boolean | null;
    declare nabovarselSendt?: string | null;
    declare nabovarselSendtVia: Kode | undefined | null;
    declare samtykkeMottattDato?: string | null;
    declare merknadMottattDato?: string | null;

    /**
     * Constructs a new Respons instance.
     * @param {Object} props - The properties to initialize the Respons instance.
     * @param {boolean} [props.erMerknadMottatt] - Indicates if a remark has been received.
     * @param {boolean} [props.erSamtykkeMottatt] - Indicates if consent has been received.
     * @param {string} [props.nabovarselSendt] - The date the neighbor notification was sent.
     * @param {string|Object} [props.nabovarselSendtVia] - The method by which the neighbor notification was sent.
     * @param {string} [props.samtykkeMottattDato] - The date consent was received.
     * @param {string} [props.merknadMottattDato] - The date a remark was received.
     */
    constructor(props?: ResponsProps) {
        this.erMerknadMottatt = props?.erMerknadMottatt;
        this.erSamtykkeMottatt = props?.erSamtykkeMottatt;
        this.nabovarselSendt = props?.nabovarselSendt;
        this.nabovarselSendtVia = props?.nabovarselSendtVia && new Kode(props.nabovarselSendtVia);
        this.samtykkeMottattDato = props?.samtykkeMottattDato;
        this.merknadMottattDato = props?.merknadMottattDato;
    }
}
