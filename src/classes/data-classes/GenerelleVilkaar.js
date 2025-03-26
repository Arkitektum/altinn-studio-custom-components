/**
 * Class representing GenerelleVilkaar.
 * @class
 */
export default class GenerelleVilkaar {
    /**
     * Constructs an instance of the GenerelleVilkaar class.
     *
     * @param {Object} props - The properties to initialize the class with.
     * @param {string} [props.norskSvenskDansk] - A string representing the Norwegian, Swedish, or Danish value.
     */
    constructor(props) {
        this.norskSvenskDansk = props?.norskSvenskDansk;
    }
}
