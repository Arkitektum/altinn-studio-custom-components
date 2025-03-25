import Kode from "./Kode.js";

export default class Posisjon {
    constructor(props) {
        this.koordinatsystem = props?.koordinatsystem && new Kode(props.koordinatsystem);
        this.koordinater = props?.koordinater;
        this.vertikalnivaa = props?.vertikalnivaa && new Kode(props.vertikalnivaa);
    }
}
