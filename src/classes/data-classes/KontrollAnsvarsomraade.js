// Classes
import KontrollerendeList from "../system-classes/data-classes/KontrollerendeList.js";
import Kode from "./Kode.js";

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
    constructor(props, resourceBindings) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.beskrivelseAvAnsvarsomraadet = props?.beskrivelseAvAnsvarsomraadet;
        this.kontrollerendeList = new KontrollerendeList(props?.kontrollerende, resourceBindings);
        this.datoAnsvarsrettErklaert = props?.datoAnsvarsrettErklaert;
        this.erAnsvarsomraadetAvsluttet = props?.erAnsvarsomraadetAvsluttet;
        this.soeknadssystemetsReferanse = props?.soeknadssystemetsReferanse;
    }
}
