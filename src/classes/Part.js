/**
 * Class representing a Part.
 */
export default class Part {
    /**
     * Create a Part.
     * @param {Object} props - The properties of the Part.
     * @param {string} props.navn - The name of the Part.
     * @param {string} props.organisasjonsnummer - The organization number of the Part.
     */
    constructor(props) {
        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
    }
}
