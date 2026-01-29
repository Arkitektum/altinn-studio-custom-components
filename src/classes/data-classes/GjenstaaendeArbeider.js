/**
 * Represents remaining work, categorized as within or outside a certain scope.
 *
 * @class
 * @param {Object} props - The properties for initializing the class.
 * @param {*} [props.gjenstaaendeInnenfor] - Remaining work within the specified scope.
 * @param {*} [props.gjenstaaendeUtenfor] - Remaining work outside the specified scope.
 */
export default class GjenstaaendeArbeider {
    constructor(props) {
        this.gjenstaaendeInnenfor = props?.gjenstaaendeInnenfor;
        this.gjenstaaendeUtenfor = props?.gjenstaaendeUtenfor;
    }
}
