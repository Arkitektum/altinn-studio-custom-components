import Eiendom from "./Eiendom.js";

export default class EiendomByggested {
    constructor(props) {
        this.eiendom =
            props?.eiendom &&
            props.eiendom.map((eiendomItem) => {
                return new Eiendom(eiendomItem);
            });
    }
}
