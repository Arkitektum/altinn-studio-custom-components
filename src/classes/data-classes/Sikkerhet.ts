/** What the form data holds for a Sikkerhet, before it is read into the class. */
export interface SikkerhetProps {
    harTilstrekkeligSikkerhet?: boolean;
    typeArbeider?: string;
    utfoertInnen?: string;
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
    declare harTilstrekkeligSikkerhet?: boolean;
    declare typeArbeider?: string;
    declare utfoertInnen?: string;

    constructor(props?: SikkerhetProps) {
        this.harTilstrekkeligSikkerhet = props?.harTilstrekkeligSikkerhet;
        this.typeArbeider = props?.typeArbeider;
        this.utfoertInnen = props?.utfoertInnen;
    }
}
