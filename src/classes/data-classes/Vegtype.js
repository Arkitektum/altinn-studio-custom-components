import Kode from "./Kode.js";

/**
 * Represents a Vegtype with a list of Kode instances.
 * @class
 * @param {Object} props - The properties to initialize the Vegtype.
 * @param {Array<Object>} [props.kode] - An array of kode items to be mapped to Kode instances.
 */
export default class Vegtype {
    constructor(props) {
        this.kode =
            props?.kode &&
            props.kode?.map((kodeItem) => {
                return new Kode(kodeItem);
            });
    }
}
