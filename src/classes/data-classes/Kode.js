/**
 * Class representing a Kode.
 * @class
 */
export default class Kode {
    /**
     * Create a Kode.
     * @param {Object} props - The properties object.
     * @param {string} props.kodebeskrivelse - The description code.
     */
    constructor(props) {
        this.kodebeskrivelse = props?.kodebeskrivelse;
    }
}
