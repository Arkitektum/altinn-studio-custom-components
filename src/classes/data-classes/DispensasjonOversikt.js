import Dispensasjon from "./Dispensasjon";

/**
 * @typedef {Object} DispensasjonOversiktProps
 * @property {Array} [dispensasjon] - An array of Dispensasjon instances.
 */
export default class DispensasjonOversikt {
    constructor(props) {
        this.dispensasjon =
            props?.dispensasjon &&
            props.dispensasjon.map((dispensasjonItem) => {
                return new Dispensasjon(dispensasjonItem);
            });
    }
}
