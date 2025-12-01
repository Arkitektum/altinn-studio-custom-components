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

    /**
     * Generates an array of bebyggelsen (building) items based on the provided arealdisponering data and resource bindings.
     * Each item represents a specific area type if its value exists, and includes associated resource bindings.
     * The returned array excludes any items with missing values.
     *
     * @param {Object} arealdisponering - The object containing area disposition data.
     * @param {Object} resourceBindings - The object containing resource bindings for each area type.
     * @returns {Array<Object>} An array of objects, each with `resourceValues` and `resourceBindings` properties.
     */
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

    /**
     * Generates an array of tomteareal items based on the provided arealdisponering object and resource bindings.
     * Each item represents a specific tomteareal value with its associated resource bindings and a flag indicating if it is a total.
     * Only items with a value are included in the returned array.
     *
     * @param {Object} arealdisponering - The object containing tomteareal data fields.
     * @param {Object} resourceBindings - The object containing resource bindings for each tomteareal field.
     * @returns {Array<Object>} An array of tomteareal items, each with resourceValues and resourceBindings.
     */
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
            hasValue(arealdisponering?.tomtearealSomLeggesTil)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealSomLeggesTil,
                          isTotal: false
                      },
                      resourceBindings: resourceBindings?.tomtearealSomLeggesTil
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
