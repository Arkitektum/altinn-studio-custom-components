// Classes
import ProsjekterendeList from "../system-classes/data-classes/ProsjekterendeList.js";
import Kode from "./Kode.js";
import Utfoerende from "./Utfoerende.js";

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
    constructor(props, resourceBindings) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.beskrivelseAvAnsvarsomraadet = props?.beskrivelseAvAnsvarsomraadet;
        this.prosjekterendeList = new ProsjekterendeList(props?.funksjon?.kodeverdi, props?.prosjekterende, resourceBindings);
        this.utfoerende = new Utfoerende(props?.utfoerende, resourceBindings);
        this.datoAnsvarsrettErklaert = props?.datoAnsvarsrettErklaert;
        this.erAnsvarsomraadetAvsluttet = props?.erAnsvarsomraadetAvsluttet;
        this.soeknadssystemetsReferanse = props?.soeknadssystemetsReferanse;
    }
}
