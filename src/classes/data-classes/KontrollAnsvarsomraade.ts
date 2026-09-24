import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";
import KontrollerendeList from "../system-classes/data-classes/KontrollerendeList.js";

/** What the form data holds for a KontrollAnsvarsomraade, before it is read into the class. */
export interface KontrollAnsvarsomraadeProps {
    funksjon?: KodeProps | null;
    beskrivelseAvAnsvarsomraadet?: string;
    datoAnsvarsrettErklaert?: string;
    erAnsvarsomraadetAvsluttet?: boolean;
    soeknadssystemetsReferanse?: string;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Constructs a new KontrollAnsvarsomraade instance.
 *
 * @param {Object} props - The properties for initializing the instance.
 * @param {Object} [props.funksjon] - The function code, used to create a new Kode instance.
 * @param {string} [props.beskrivelseAvAnsvarsomraadet] - Description of the area of responsibility.
 * @param {Array|Object} [props.kontrollerende] - Data for initializing the KontrollerendeList.
 * @param {string} [props.datoAnsvarsrettErklaert] - Date when the responsibility was declared.
 * @param {boolean} [props.erAnsvarsomraadetAvsluttet] - Indicates if the area of responsibility is concluded.
 * @param {string} [props.soeknadssystemetsReferanse] - Reference from the application system.
 * @param {Object} resourceBindings - Resource bindings used for initializing KontrollerendeList.
 */
export default class KontrollAnsvarsomraade {
    declare funksjon: Kode | null | undefined;
    declare beskrivelseAvAnsvarsomraadet?: string;
    declare kontrollerendeList: KontrollerendeList | null | undefined;
    declare datoAnsvarsrettErklaert?: string;
    declare erAnsvarsomraadetAvsluttet?: boolean;
    declare soeknadssystemetsReferanse?: string;

    constructor(props?: KontrollAnsvarsomraadeProps, resourceBindings?: Record<string, unknown>) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.beskrivelseAvAnsvarsomraadet = props?.beskrivelseAvAnsvarsomraadet;
        this.kontrollerendeList = new KontrollerendeList(props?.kontrollerende, resourceBindings);
        this.datoAnsvarsrettErklaert = props?.datoAnsvarsrettErklaert;
        this.erAnsvarsomraadetAvsluttet = props?.erAnsvarsomraadetAvsluttet;
        this.soeknadssystemetsReferanse = props?.soeknadssystemetsReferanse;
    }
}
