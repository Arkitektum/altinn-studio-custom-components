/**
 * Class representing an AnsvarligSoeker.
 */
export default class AnsvarligSoeker {
    /**
     * Create an AnsvarligSoeker.
     * @param {Object} props - The properties of the AnsvarligSoeker.
     * @param {string} props.navn - The name of the AnsvarligSoeker.
     * @param {string} props.organisasjonsnummer - The organization number of the AnsvarligSoeker.
     */
    constructor(props) {
        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
    }
}
