/**
 * Class representing a Kode.
 * @class
 */
export default class Kode {
    /**
     * Create a Kode.
     * @param {Object} props - The properties object.
     * @param {string} props.kodeverdi - The value code.
     * @param {string} props.kodebeskrivelse - The description code.
     */
    constructor(props) {
        this.kodeverdi = props?.kodeverdi;
        this.kodebeskrivelse = props?.kodebeskrivelse;
    }
}
