import GjenstaaendeArbeider from "./GjenstaaendeArbeider";
import Sikkerhet from "./Sikkerhet";

/**
 * Represents a temporary usage permit (Midlertidig Brukstillatelse).
 *
 * @class
 * @param {Object} props - The properties to initialize the instance.
 * @param {boolean} [props.erOkForMidlertidigBrukstillatelse] - Indicates if the temporary usage permit is approved.
 * @param {Object} [props.gjenstaaendeArbeider] - Data for remaining work, used to instantiate a GjenstaaendeArbeider object.
 * @param {Object} [props.sikkerhet] - Data for safety, used to instantiate a Sikkerhet object.
 */
export default class MidlertidigBrukstillatelse {
    constructor(props) {
        this.erOkForMidlertidigBrukstillatelse = props?.erOkForMidlertidigBrukstillatelse;
        this.gjenstaaendeArbeider = props?.gjenstaaendeArbeider && new GjenstaaendeArbeider(props.gjenstaaendeArbeider);
        this.sikkerhet = props?.sikkerhet && new Sikkerhet(props.sikkerhet);
    }
}
