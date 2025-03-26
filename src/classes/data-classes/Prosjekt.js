/**
 * Class representing a project.
 * @class
 */
export default class Prosjekt {
    /**
     * Creates an instance of Prosjekt.
     * @param {Object} props - The properties of the project.
     * @param {string} props.prosjektnavn - The name of the project.
     * @param {number} props.prosjektnr - The number of the project.
     */
    constructor(props) {
        this.prosjektnavn = props?.prosjektnavn;
        this.prosjektnr = props?.prosjektnr;
    }
}
