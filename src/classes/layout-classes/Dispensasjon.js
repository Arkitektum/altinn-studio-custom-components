import Begrunnelse from "../data-classes/Begrunnelse.js";
import DispensasjonBeskrivelse from "../data-classes/DispensasjonBeskrivelse.js";
import DispensasjonFra from "../data-classes/DispensasjonFra.js";
import EiendomByggested from "../data-classes/EiendomByggested.js";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.js";
import Metadata from "../data-classes/Metadata.js";
import Part from "../data-classes/Part.js";
import Stedfesting from "../data-classes/Stedfesting.js";
import Varighet from "../data-classes/Varighet.js";

export default class Dispensasjon {
    constructor(props) {
        this.dispensasjonBeskrivelse =
            props?.dispensasjonBeskrivelse && new DispensasjonBeskrivelse(props.dispensasjonBeskrivelse);
        this.dispensasjonReferanse = props?.dispensasjonReferanse;
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.tiltakshaver = props?.tiltakshaver && new Part(props.tiltakshaver);
        this.dispensasjonFra = props?.dispensasjonFra && new DispensasjonFra(props.dispensasjonFra);
        this.stedfesting = props?.stedfesting && new Stedfesting(props.stedfesting);
        this.varighet = props?.varighet && new Varighet(props.varighet);
        this.begrunnelse = props?.begrunnelse && new Begrunnelse(props.begrunnelse);
        this.generelleVilkaar = props?.generelleVilkaar;
    }
}
