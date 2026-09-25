/** What the form data holds for a GjenstaaendeArbeider, before it is read into the class. */
export interface GjenstaaendeArbeiderProps {
    gjenstaaendeInnenfor?: string | null;
    gjenstaaendeUtenfor?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Represents remaining work, categorized as within or outside a certain scope.
 *
 * @class
 * @param {Object} props - The properties for initializing the class.
 * @param {string} [props.gjenstaaendeInnenfor] - Remaining work within the specified scope.
 * @param {string} [props.gjenstaaendeUtenfor] - Remaining work outside the specified scope.
 */
export default class GjenstaaendeArbeider {
    declare gjenstaaendeInnenfor?: string | null;
    declare gjenstaaendeUtenfor?: string | null;

    constructor(props?: GjenstaaendeArbeiderProps) {
        this.gjenstaaendeInnenfor = props?.gjenstaaendeInnenfor;
        this.gjenstaaendeUtenfor = props?.gjenstaaendeUtenfor;
    }
}
