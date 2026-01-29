import UtfoerendeList from "../system-classes/data-classes/UtfoerendeList.js";
import MidlertidigBrukstillatelse from "./MidlertidigBrukstillatelse.js";

/**
 * Represents an executing entity with temporary usage permission and attestation status.
 *
 * @class
 * @param {Object} props - The properties for initializing the Utfoerende instance.
 * @param {Object} [props.midlertidigBrukstillatelse] - Data for temporary usage permission.
 * @param {boolean} [props.erOkForFerdigattest] - Indicates if the entity is approved for attestation.
 * @param {boolean} [props.erOkForMidlertidigBrukstillatelse] - Indicates if the entity is approved for temporary usage permission.
 * @param {Object} resourceBindings - Resource bindings used for initializing the UtfoerendeList.
 *
 * @property {MidlertidigBrukstillatelse|undefined} midlertidigBrukstillatelse - Instance representing temporary usage permission.
 * @property {boolean|undefined} erOkForFerdigattest - Approval status for attestation.
 * @property {UtfoerendeList} utfoerendeList - List of executing entities.
 */
export default class Utfoerende {
    constructor(props, resourceBindings) {
        this.midlertidigBrukstillatelse = props?.midlertidigBrukstillatelse && new MidlertidigBrukstillatelse(props.midlertidigBrukstillatelse);
        this.erOkForFerdigattest = props?.erOkForFerdigattest;
        this.utfoerendeList = new UtfoerendeList(
            props?.erOkForFerdigattest,
            props?.midlertidigBrukstillatelse?.erOkForMidlertidigBrukstillatelse,
            resourceBindings
        );
    }
}
