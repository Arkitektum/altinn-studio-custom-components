/**
 * Class representing a UtfallSvarTema.
 * @class
 */
export default class UtfallSvarTema {
    /**
     * Create a UtfallSvarTema.
     * @param {Object} props - The properties object.
     * @param {string} props.kodebeskrivelse - The description code.
     */
    constructor(props) {
        this.kodebeskrivelse = props?.kodebeskrivelse;
    }
}
