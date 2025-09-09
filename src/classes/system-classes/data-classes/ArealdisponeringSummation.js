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
                          data: arealdisponering?.beregnetMaksByggeareal,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.beregnetMaksByggeareal
                  }
                : null,
            hasValue(arealdisponering?.arealBebyggelseEksisterende)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseEksisterende,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.arealBebyggelseEksisterende
                  }
                : null,
            hasValue(arealdisponering?.arealBebyggelseSomSkalRives)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseSomSkalRives,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.arealBebyggelseSomSkalRives
                  }
                : null,
            hasValue(arealdisponering?.arealBebyggelseNytt)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseNytt,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.arealBebyggelseNytt
                  }
                : null,
            hasValue(arealdisponering?.parkeringsarealTerreng)
                ? {
                      resourceValues: {
                          data: arealdisponering?.parkeringsarealTerreng,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.parkeringsarealTerreng
                  }
                : null,
            hasValue(arealdisponering?.arealSumByggesak)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealSumByggesak,
                          isTotal: true
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
                          data: arealdisponering?.tomtearealByggeomraade,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.tomtearealByggeomraade
                  }
                : null,
            hasValue(arealdisponering?.tomtearealSomTrekkesFra)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealSomTrekkesFra,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.tomtearealSomTrekkesFra
                  }
                : null,
            hasValue(arealdisponering?.tomtearealBeregnet)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealBeregnet,
                          isTotal: true
                      },
                      resourceBindings: resourceBindings?.tomtearealBeregnet
                  }
                : null
        ].filter((item) => item !== null);
    }
}
