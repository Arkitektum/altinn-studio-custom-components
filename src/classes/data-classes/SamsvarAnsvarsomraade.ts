import type { KodeProps } from "./Kode.ts";
import type { ProsjekterendeProps } from "../system-classes/data-classes/ProsjekterendeList.ts";
import type { UtfoerendeProps } from "./Utfoerende.ts";
// Classes
import Kode from "./Kode.ts";
import ProsjekterendeList from "../system-classes/data-classes/ProsjekterendeList.ts";
import Utfoerende from "./Utfoerende.ts";

/** What the form data holds for a SamsvarAnsvarsomraade, before it is read into the class. */
export interface SamsvarAnsvarsomraadeProps {
    funksjon?: KodeProps | null;
    beskrivelseAvAnsvarsomraadet?: unknown;
    prosjekterende?: ProsjekterendeProps | null;
    utfoerende?: UtfoerendeProps | null;
    datoAnsvarsrettErklaert?: unknown;
    erAnsvarsomraadetAvsluttet?: unknown;
    soeknadssystemetsReferanse?: unknown;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Represents a SamsvarAnsvarsomraade (Compliance Area of Responsibility).
 *
 * @class
 * @param {Object} props - The properties to initialize the instance with.
 * @param {Object} resourceBindings - Resource bindings used for initializing nested objects.
 * @property {Kode} funksjon - The function code, wrapped in a Kode instance.
 * @property {string} beskrivelseAvAnsvarsomraadet - Description of the area of responsibility.
 * @property {ProsjekterendeList} prosjekterendeList - List of designers, initialized with ProsjekterendeList.
 * @property {Utfoerende} utfoerende - The executor, initialized with Utfoerende.
 * @property {string} datoAnsvarsrettErklaert - Date when responsibility was declared.
 * @property {boolean} erAnsvarsomraadetAvsluttet - Indicates if the area of responsibility is closed.
 * @property {string} soeknadssystemetsReferanse - Reference from the application system.
 */
export default class SamsvarAnsvarsomraade {
    declare funksjon: Kode | null | undefined;
    declare beskrivelseAvAnsvarsomraadet?: unknown;
    declare prosjekterendeList: ProsjekterendeList | null | undefined;
    declare utfoerende: Utfoerende | null | undefined;
    declare datoAnsvarsrettErklaert?: unknown;
    declare erAnsvarsomraadetAvsluttet?: unknown;
    declare soeknadssystemetsReferanse?: unknown;

    constructor(props?: SamsvarAnsvarsomraadeProps, resourceBindings?: Record<string, unknown>) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.beskrivelseAvAnsvarsomraadet = props?.beskrivelseAvAnsvarsomraadet;
        this.prosjekterendeList = new ProsjekterendeList(props?.prosjekterende, resourceBindings);
        this.utfoerende = new Utfoerende(props?.utfoerende, resourceBindings);
        this.datoAnsvarsrettErklaert = props?.datoAnsvarsrettErklaert;
        this.erAnsvarsomraadetAvsluttet = props?.erAnsvarsomraadetAvsluttet;
        this.soeknadssystemetsReferanse = props?.soeknadssystemetsReferanse;
    }
}
