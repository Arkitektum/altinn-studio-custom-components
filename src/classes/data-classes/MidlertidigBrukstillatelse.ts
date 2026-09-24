import GjenstaaendeArbeider from "./GjenstaaendeArbeider.ts";
import type { GjenstaaendeArbeiderProps } from "./GjenstaaendeArbeider.ts";
import Sikkerhet from "./Sikkerhet.ts";
import type { SikkerhetProps } from "./Sikkerhet.ts";

/** What the form data holds for a MidlertidigBrukstillatelse, before it is read into the class. */
export interface MidlertidigBrukstillatelseProps {
    erOkForMidlertidigBrukstillatelse?: boolean;
    gjenstaaendeArbeider?: GjenstaaendeArbeiderProps | undefined;
    sikkerhet?: SikkerhetProps | undefined;
}

/**
 * Represents a temporary usage permit (Midlertidig Brukstillatelse).
 *
 * @class
 * @param {Object} props - The properties to initialize the instance.
 * @param {boolean} [props.erOkForMidlertidigBrukstillatelse] - Indicates if the temporary usage permit is approved.
 * @param {Object} [props.gjenstaaendeArbeider] - Data for remaining work, used to instantiate a GjenstaaendeArbeider object.
 * @param {Object} [props.sikkerhet] - Data for safety, used to instantiate a Sikkerhet object.
 */
export default class MidlertidigBrukstillatelse {
    declare erOkForMidlertidigBrukstillatelse?: boolean;
    declare gjenstaaendeArbeider: GjenstaaendeArbeider | undefined;
    declare sikkerhet: Sikkerhet | undefined;

    constructor(props?: MidlertidigBrukstillatelseProps) {
        this.erOkForMidlertidigBrukstillatelse = props?.erOkForMidlertidigBrukstillatelse;
        this.gjenstaaendeArbeider = props?.gjenstaaendeArbeider && new GjenstaaendeArbeider(props.gjenstaaendeArbeider);
        this.sikkerhet = props?.sikkerhet && new Sikkerhet(props.sikkerhet);
    }
}
