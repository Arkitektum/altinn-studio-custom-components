/**
 * Class representing a Vedleggstype.
 * @class
 */
export default class Vedleggstype {
    /**
     * Creates an instance of Vedleggstype.
     * @param {Object} props - The properties to initialize the Vedleggstype.
     * @param {string} [props.kodebeskrivelse] - The description of the code.
     */
    constructor(props) {
        this.kodebeskrivelse = props?.kodebeskrivelse;
    }
}
