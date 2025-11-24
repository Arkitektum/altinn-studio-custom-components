// Classes
import Kode from "./Kode.js";

/**
 * Class representing a Respons.
 * @class
 */
export default class Respons {
    /**
     * Constructs a new Respons instance.
     * @param {Object} props - The properties to initialize the Respons instance.
     * @param {boolean} [props.erMerknadMottatt] - Indicates if a remark has been received.
     * @param {boolean} [props.erSamtykkeMottatt] - Indicates if consent has been received.
     * @param {string} [props.merknadMottattDato] - The date the remark was received.
     * @param {string|Object} [props.nabovarselSendtVia] - The method by which the neighbor notification was sent.
     * @param {string} [props.samtykkeMottattDato] - The date consent was received.
     */
    constructor(props) {
        this.erMerknadMottatt = props?.erMerknadMottatt;
        this.erSamtykkeMottatt = props?.erSamtykkeMottatt;
        this.merknadMottattDato = props?.merknadMottattDato;
        this.nabovarselSendtVia = props?.nabovarselSendtVia && new Kode(props.nabovarselSendtVia);
        this.samtykkeMottattDato = props?.samtykkeMottattDato;
    }
}
