import Fordeler from "./Fordeler.js";
import Ulemper from "./Ulemper.js";

export default class Begrunnelse {
    constructor(props) {
        this.hensynBakBestemmelsen = props?.hensynBakBestemmelsen;
        this.vurderingHensynBakBestemmelsen = props?.vurderingHensynBakBestemmelsen;
        this.vurderingHensynOverordnet = props?.vurderingHensynOverordnet;
        this.fordeler = props?.fordeler && new Fordeler(props.fordeler);
        this.ulemper = props?.ulemper && new Ulemper(props.ulemper);
        this.samletBegrunnelse = props?.samletBegrunnelse;
    }
}
