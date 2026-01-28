// Classes
import FaseSamsvarKontrollList from "../system-classes/data-classes/FaseSamsvarKontrollList.js";
import Kode from "./Kode.js";

/**
 * Class representing a responsibility area.
 * @class
 */
export default class AnsvarsrettAnsvarsomraade {
    constructor(props, resourceBindings) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.beskrivelseAvAnsvarsomraadet = props?.beskrivelseAvAnsvarsomraadet;
        this.tiltaksklasse = props?.tiltaksklasse && new Kode(props.tiltaksklasse);
        this.dekkesOmraadeAvSentralGodkjenning = props?.dekkesOmraadeAvSentralGodkjenning;
        this.faseSamsvarKontrollList = new FaseSamsvarKontrollList(props.faseSamsvarKontroll, resourceBindings);
        this.soeknadssystemetsReferanse = props?.soeknadssystemetsReferanse;
    }
}
