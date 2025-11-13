// Classes
import PlanlagteSamsvarKontrollErklaeringerList from "../system-classes/data-classes/PlanlagteSamsvarKontrollErklaeringerList.js";
import Kode from "./Kode.js";
import Part from "./Part.js";

/**
 * Class representing a responsibility area.
 * @class
 */
export default class Ansvarsomraade {
    constructor(props, resourceBindings) {
        this.funksjon = props?.funksjon && new Kode(props.funksjon);
        this.tiltaksklasse = props?.tiltaksklasse && new Kode(props.tiltaksklasse);
        this.ansvarsomraade = props?.ansvarsomraade;
        this.foretak = props?.foretak && new Part(props.foretak);
        this.planlagteSamsvarKontrollErklaeringerList = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        this.ansvarsomraadeStatus = props?.ansvarsomraadeStatus && new Kode(props.ansvarsomraadeStatus);
    }
}
