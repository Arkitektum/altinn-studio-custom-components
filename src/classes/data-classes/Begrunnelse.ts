import type { FordelerProps } from "./Fordeler.ts";
import type { UlemperProps } from "./Ulemper.ts";
// Classes
import Fordeler from "./Fordeler.ts";
import Ulemper from "./Ulemper.ts";

/** What the form data holds for a Begrunnelse, before it is read into the class. */
export interface BegrunnelseProps {
    hensynBakBestemmelsen?: string;
    vurderingHensynBakBestemmelsen?: string;
    vurderingHensynOverordnet?: string;
    fordeler?: FordelerProps | undefined;
    ulemper?: UlemperProps | undefined;
    samletBegrunnelse?: string;
}

/**
 * Class representing a Begrunnelse.
 * @class
 */
export default class Begrunnelse {
    declare hensynBakBestemmelsen?: string;
    declare vurderingHensynBakBestemmelsen?: string;
    declare vurderingHensynOverordnet?: string;
    declare fordeler: Fordeler | undefined;
    declare ulemper: Ulemper | undefined;
    declare samletBegrunnelse?: string;

    /**
     * Constructs a new instance of the Begrunnelse class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.hensynBakBestemmelsen] - The considerations behind the provision.
     * @param {string} [props.vurderingHensynBakBestemmelsen] - The assessment of the considerations behind the provision.
     * @param {string} [props.vurderingHensynOverordnet] - The overarching assessment of considerations.
     * @param {Object} [props.fordeler] - The advantages, used to create a new instance of the Fordeler class.
     * @param {Object} [props.ulemper] - The disadvantages, used to create a new instance of the Ulemper class.
     * @param {string} [props.samletBegrunnelse] - The overall justification.
     */
    constructor(props?: BegrunnelseProps) {
        this.hensynBakBestemmelsen = props?.hensynBakBestemmelsen;
        this.vurderingHensynBakBestemmelsen = props?.vurderingHensynBakBestemmelsen;
        this.vurderingHensynOverordnet = props?.vurderingHensynOverordnet;
        this.fordeler = props?.fordeler && new Fordeler(props.fordeler);
        this.ulemper = props?.ulemper && new Ulemper(props.ulemper);
        this.samletBegrunnelse = props?.samletBegrunnelse;
    }
}
