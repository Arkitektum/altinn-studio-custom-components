// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Class representing a summation of area disposition.
 * @class
 */
export default class ArealdisponeringSummation {
    constructor(arealdisponering, resourceBindings) {
        this.tomtearealet = {
            resourceBindings: {
                title: resourceBindings?.tomtearealet?.title
            },
            resourceValues: {
                data: this.getTomtearealetItems(arealdisponering, resourceBindings)
            }
        };
        this.bebyggelsen = {
            resourceBindings: {
                title: resourceBindings?.bebyggelsen?.title
            },
            resourceValues: {
                data: this.getBebyggelsenItems(arealdisponering, resourceBindings)
            }
        };
    }

    getBebyggelsenItems(arealdisponering, resourceBindings) {
        return [
            hasValue(arealdisponering?.beregnetMaksByggeareal)
                ? {
                      resourceValues: {
                          data: arealdisponering?.beregnetMaksByggeareal
                      },
                      resourceBindings: resourceBindings?.beregnetMaksByggeareal
                  }
                : null,
            hasValue(arealdisponering?.arealBebyggelseEksisterende)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseEksisterende
                      },
                      resourceBindings: resourceBindings?.arealBebyggelseEksisterende
                  }
                : null,
            hasValue(arealdisponering?.arealBebyggelseSomSkalRives)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseSomSkalRives
                      },
                      resourceBindings: resourceBindings?.arealBebyggelseSomSkalRives
                  }
                : null,
            hasValue(arealdisponering?.arealBebyggelseNytt)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseNytt
                      },
                      resourceBindings: resourceBindings?.arealBebyggelseNytt
                  }
                : null,
            hasValue(arealdisponering?.parkeringsarealTerreng)
                ? {
                      resourceValues: {
                          data: arealdisponering?.parkeringsarealTerreng
                      },
                      resourceBindings: resourceBindings?.parkeringsarealTerreng
                  }
                : null,
            hasValue(arealdisponering?.arealSumByggesak)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealSumByggesak
                      },
                      resourceBindings: resourceBindings?.arealSumByggesak
                  }
                : null
        ].filter((item) => item !== null);
    }

    getTomtearealetItems(arealdisponering, resourceBindings) {
        return [
            hasValue(arealdisponering?.tomtearealByggeomraade)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealByggeomraade
                      },
                      resourceBindings: resourceBindings?.tomtearealByggeomraade
                  }
                : null,
            hasValue(arealdisponering?.tomtearealSomTrekkesFra)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealSomTrekkesFra
                      },
                      resourceBindings: resourceBindings?.tomtearealSomTrekkesFra
                  }
                : null,
            hasValue(arealdisponering?.tomtearealBeregnet)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealBeregnet
                      },
                      resourceBindings: resourceBindings?.tomtearealBeregnet
                  }
                : null
        ].filter((item) => item !== null);
    }
}
