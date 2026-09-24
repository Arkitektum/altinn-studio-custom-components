/** What the form data holds for a GenerelleVilkaar, before it is read into the class. */
export interface GenerelleVilkaarProps {
    norskSvenskDansk?: string;
}

/**
 * Class representing GenerelleVilkaar.
 * @class
 */
export default class GenerelleVilkaar {
    declare norskSvenskDansk?: string;

    /**
     * Constructs an instance of the GenerelleVilkaar class.
     *
     * @param {Object} props - The properties to initialize the class with.
     * @param {string} [props.norskSvenskDansk] - A string representing the Norwegian, Swedish, or Danish value.
     */
    constructor(props?: GenerelleVilkaarProps) {
        this.norskSvenskDansk = props?.norskSvenskDansk;
    }
}
