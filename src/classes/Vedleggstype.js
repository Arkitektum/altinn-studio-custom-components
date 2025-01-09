/**
 * Class representing a Vedleggstype.
 */
export default class Vedleggstype {
    /**
     * Create a Vedleggstype.
     * @param {Object} props - The properties object.
     * @param {string} [props.kodebeskrivelse] - The description of the code.
     */
    constructor(props) {
        this.kodebeskrivelse = props?.kodebeskrivelse;
    }
}
