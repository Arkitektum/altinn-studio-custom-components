/**
 * Class representing an area disposition.
 * @class
 */
export default class Arealdisponering {
    /**
     * Creates an instance of Arealdisponering.
     * @param {Object} props - The properties of the area disposition.
     * @param {number} [props.arealBebyggelseEksisterende] - The existing building area.
     * @param {number} [props.arealBebyggelseNytt] - The new building area.
     * @param {number} [props.arealBebyggelseSomSkalRives] - The building area to be demolished.
     * @param {number} [props.arealSumByggesak] - The total area for the building case.
     * @param {number} [props.beregnetGradAvUtnytting] - The calculated degree of utilization.
     * @param {number} [props.beregnetMaksByggeareal] - The calculated maximum building area.
     * @param {number} [props.parkeringsarealTerreng] - The parking area on the terrain.
     * @param {number} [props.tomtearealBeregnet] - The calculated plot area.
     * @param {number} [props.tomtearealByggeomraade] - The plot area of the building area.
     * @param {number} [props.tomtearealSomLeggesTil] - The plot area to be added.
     * @param {number} [props.tomtearealSomTrekkesFra] - The plot area to be deducted.
     */
    constructor(props) {
        this.arealBebyggelseEksisterende = props?.arealBebyggelseEksisterende;
        this.arealBebyggelseNytt = props?.arealBebyggelseNytt;
        this.arealBebyggelseSomSkalRives = props?.arealBebyggelseSomSkalRives;
        this.arealSumByggesak = props?.arealSumByggesak;
        this.beregnetGradAvUtnytting = props?.beregnetGradAvUtnytting;
        this.beregnetMaksByggeareal = props?.beregnetMaksByggeareal;
        this.parkeringsarealTerreng = props?.parkeringsarealTerreng;
        this.tomtearealBeregnet = props?.tomtearealBeregnet;
        this.tomtearealByggeomraade = props?.tomtearealByggeomraade;
        this.tomtearealSomLeggesTil = props?.tomtearealSomLeggesTil;
        this.tomtearealSomTrekkesFra = props?.tomtearealSomTrekkesFra;
    }
}
