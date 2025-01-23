import UtfallSvarTema from "./UtfallSvarTema";
import UtfallType from "./UtfallType";
import Vedleggsliste from "./Vedleggsliste";

export default class UtfallSvar {
    constructor(props) {
        this.beskrivelse = props?.beskrivelse;
        this.erUtfallBesvaresSenere = props?.erUtfallBesvaresSenere;
        this.erUtfallBesvart = props?.erUtfallBesvart;
        this.kommentar = props?.kommentar;
        this.tema = props?.tema && new UtfallSvarTema(props.tema);
        this.tittel = props?.tittel;
        this.utfallType = props?.utfallType && new UtfallType(props.utfallType);
        this.vedleggsliste = props?.vedleggsliste && new Vedleggsliste(props.vedleggsliste);
    }
}
