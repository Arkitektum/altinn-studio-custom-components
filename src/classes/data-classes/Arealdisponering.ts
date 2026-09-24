/** What the form data holds for a Arealdisponering, before it is read into the class. */
export interface ArealdisponeringProps {
    arealBebyggelseEksisterende?: number | null;
    arealBebyggelseNytt?: number | null;
    arealBebyggelseSomSkalRives?: number | null;
    arealSumByggesak?: number | null;
    beregnetGradAvUtnytting?: number | null;
    beregnetMaksByggeareal?: number | null;
    parkeringsarealTerreng?: number | null;
    tomtearealBeregnet?: number | null;
    tomtearealByggeomraade?: number | null;
    tomtearealSomLeggesTil?: number | null;
    tomtearealSomTrekkesFra?: number | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an area disposition.
 * @class
 */
export default class Arealdisponering {
    declare arealBebyggelseEksisterende?: number | null;
    declare arealBebyggelseNytt?: number | null;
    declare arealBebyggelseSomSkalRives?: number | null;
    declare arealSumByggesak?: number | null;
    declare beregnetGradAvUtnytting?: number | null;
    declare beregnetMaksByggeareal?: number | null;
    declare parkeringsarealTerreng?: number | null;
    declare tomtearealBeregnet?: number | null;
    declare tomtearealByggeomraade?: number | null;
    declare tomtearealSomLeggesTil?: number | null;
    declare tomtearealSomTrekkesFra?: number | null;

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
    constructor(props?: ArealdisponeringProps) {
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
