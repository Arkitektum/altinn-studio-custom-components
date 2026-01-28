import MidlertidigBrukstillatelse from "./MidlertidigBrukstillatelse.js";

/**
 * Represents an Utfoerende (Executor/Performer).
 *
 * @class
 * @param {Object} props - The properties to initialize the Utfoerende instance.
 * @param {Object} [props.midlertidigBrukstillatelse] - Data for the temporary usage permit.
 * @param {boolean} [props.erOkForFerdigattest] - Indicates if it is approved for final certification.
 */
export default class Utfoerende {
    constructor(props) {
        this.midlertidigBrukstillatelse = props?.midlertidigBrukstillatelse && new MidlertidigBrukstillatelse(props.midlertidigBrukstillatelse);
        this.erOkForFerdigattest = props?.erOkForFerdigattest;
    }
}
