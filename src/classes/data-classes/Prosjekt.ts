/** What the form data holds for a Prosjekt, before it is read into the class. */
export interface ProsjektProps {
    prosjektnavn?: string | null;
    prosjektnr?: number | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a project.
 * @class
 */
export default class Prosjekt {
    declare prosjektnavn?: string | null;
    declare prosjektnr?: number | null;

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
