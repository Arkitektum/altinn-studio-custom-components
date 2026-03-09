// Classes
import Kode from "../data-classes/Kode.js";

/**
 * Represents a dispensasjonsvarsel object with properties corresponding to the expected structure of the data.
 * The constructor initializes the properties based on the provided input object, allowing for easy instantiation of a dispensasjonsvarsel with the relevant data.
 * @param {Object} props - The input object containing the properties to initialize the dispensasjonsvarsel.
 * @param {string} [props.annetTema] - An optional property representing another theme related to the dispensasjonsvarsel.
 * @param {string} [props.bestemmelsesoverskrift] - An optional property representing the heading of the bestemmelse.
 * @param {string} [props.bestemmelsestekst] - An optional property representing the text of the bestemmelse.
 * @param {Object} [props.bestemmelsestype] - An optional property representing the type of bestemmelse, expected to be an object that can be instantiated as a Kode.
 * @param {string} [props.dispVarselBeskrivelse] - An optional property representing the description of the dispensasjonsvarsel.
 * @param {Object} [props.dispensasjonstema] - An optional property representing the theme of the dispensasjon, expected to be an object that can be instantiated as a Kode.
 * @param {string} [props.paragrafnummer] - An optional property representing the paragraph number related to the dispensasjonsvarsel.
 * @param {string} [props.plannavn] - An optional property representing the name of the plan related to the dispensasjonsvarsel.
 * @returns {Dispensasjonsvarsel} An instance of the Dispensasjonsvarsel class with the initialized properties.
 */
export default class Dispensasjonsvarsel {
    constructor(props) {
        this.annetTema = props?.annetTema;
        this.bestemmelsesoverskrift = props?.bestemmelsesoverskrift;
        this.bestemmelsestekst = props?.bestemmelsestekst;
        this.bestemmelsestype = props?.bestemmelsestype && new Kode(props.bestemmelsestype);
        this.dispVarselBeskrivelse = props?.dispVarselBeskrivelse;
        this.dispensasjonstema = props?.dispensasjonstema && new Kode(props.dispensasjonstema);
        this.paragrafnummer = props?.paragrafnummer;
        this.plannavn = props?.plannavn;
    }
}
