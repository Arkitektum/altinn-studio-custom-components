/** What the form data holds for a Prosjekt, before it is read into the class. */
export interface ProsjektProps {
    prosjektnavn?: string;
    prosjektnr?: number;
}

/**
 * Class representing a project.
 * @class
 */
export default class Prosjekt {
    declare prosjektnavn?: string;
    declare prosjektnr?: number;

    /**
     * Creates an instance of Prosjekt.
     * @param {Object} props - The properties of the project.
     * @param {string} props.prosjektnavn - The name of the project.
     * @param {number} props.prosjektnr - The number of the project.
     */
    constructor(props?: ProsjektProps) {
        this.prosjektnavn = props?.prosjektnavn;
        this.prosjektnr = props?.prosjektnr;
    }
}
