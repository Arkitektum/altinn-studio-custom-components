// Global functions
import Kode from "./Kode.js";

export default class Plan {
    constructor(props) {
        this.navn = props?.navn;
        this.plantype = props?.plantype && new Kode(props.plantype);
    }
}
