import DispensasjonPlanBestemmelse from "./DispensasjonPlanBestemmelse.js";
import Kode from "./Kode.js";

export default class DispensasjonFra {
    constructor(props) {
        this.bestemmelserType = props?.bestemmelserType && new Kode(props.bestemmelserType);
        this.dispensasjonPlanBestemmelse =
            props?.dispensasjonPlanBestemmelse && new DispensasjonPlanBestemmelse(props.dispensasjonPlanBestemmelse);
        this.lovbestemmelse = props?.lovbestemmelse;
    }
}
