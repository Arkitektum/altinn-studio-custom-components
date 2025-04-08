// Classes
import Fordeler from "./Fordeler.js";
import Ulemper from "./Ulemper.js";

/**
 * Class representing a Begrunnelse.
 * @class
 */
export default class Begrunnelse {
    /**
     * Constructs a new instance of the Begrunnelse class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.hensynBakBestemmelsen] - The considerations behind the provision.
     * @param {string} [props.vurderingHensynBakBestemmelsen] - The assessment of the considerations behind the provision.
     * @param {string} [props.vurderingHensynOverordnet] - The overarching assessment of considerations.
     * @param {Object} [props.fordeler] - The advantages, used to create a new instance of the Fordeler class.
     * @param {Object} [props.ulemper] - The disadvantages, used to create a new instance of the Ulemper class.
     * @param {string} [props.samletBegrunnelse] - The overall justification.
     */
    constructor(props) {
        this.hensynBakBestemmelsen = props?.hensynBakBestemmelsen;
        this.vurderingHensynBakBestemmelsen = props?.vurderingHensynBakBestemmelsen;
        this.vurderingHensynOverordnet = props?.vurderingHensynOverordnet;
        this.fordeler = props?.fordeler && new Fordeler(props.fordeler);
        this.ulemper = props?.ulemper && new Ulemper(props.ulemper);
        this.samletBegrunnelse = props?.samletBegrunnelse;
    }
}
