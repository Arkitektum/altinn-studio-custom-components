/** What the form data holds for a Sikkerhet, before it is read into the class. */
export interface SikkerhetProps {
    harTilstrekkeligSikkerhet?: boolean | null;
    typeArbeider?: string | null;
    utfoertInnen?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Represents the security (Sikkerhet) data structure.
 *
 * @class
 * @param {Object} props - The properties to initialize the Sikkerhet instance.
 * @param {boolean} [props.harTilstrekkeligSikkerhet] - Indicates if there is sufficient security.
 * @param {string} [props.typeArbeider] - The type of worker.
 * @param {string} [props.utfoertInnen] - The deadline or time by which the work should be completed.
 */
export default class Sikkerhet {
    declare harTilstrekkeligSikkerhet?: boolean | null;
    declare typeArbeider?: string | null;
    declare utfoertInnen?: string | null;

    constructor(props?: SikkerhetProps) {
        this.harTilstrekkeligSikkerhet = props?.harTilstrekkeligSikkerhet;
        this.typeArbeider = props?.typeArbeider;
        this.utfoertInnen = props?.utfoertInnen;
    }
}
