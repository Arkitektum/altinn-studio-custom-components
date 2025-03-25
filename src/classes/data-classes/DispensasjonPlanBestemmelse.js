import NasjonalArealplanId from "./NasjonalArealplanId.js";
import Planbestemmelse from "./Planbestemmelse.js";

export default class DispensasjonPlanBestemmelse {
    constructor(props) {
        this.nasjonalArealplanId = props?.nasjonalArealplanId && new NasjonalArealplanId(props.nasjonalArealplanId);
        this.planbestemmelse = props?.planbestemmelse && new Planbestemmelse(props.planbestemmelse);
    }
}
