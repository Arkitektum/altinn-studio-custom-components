/**
 * Class representing an UtfallSvar.
 */
export default class UtfallSvar {
    /**
     * Create an UtfallSvar.
     * @param {Object} props - The properties object.
     * @param {boolean} props.erUtfallBesvaresSenere - Indicates if the outcome will be answered later.
     * @param {boolean} props.erUtfallBesvart - Indicates if the outcome has been answered.
     */
    constructor(props) {
        this.erUtfallBesvaresSenere = props?.erUtfallBesvaresSenere;
        this.erUtfallBesvart = props?.erUtfallBesvart;
    }
}
