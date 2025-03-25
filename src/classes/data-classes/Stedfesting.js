import Posisjon from "./Posisjon.js";

export default class Stedfesting {
    constructor(props) {
        this.posisjon = props?.posisjon && new Posisjon(props.posisjon);
    }
}
