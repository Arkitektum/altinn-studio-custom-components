// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Class representing a summation of area disposition.
 * @class
 */
export default class ArealdisponeringSummation {
    constructor(arealdisponering, resourceBindings) {
        this.tomtearealet = {
            tomtearealBeregnet: hasValue(arealdisponering?.tomtearealBeregnet)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealBeregnet
                      },
                      resourceBindings: {
                          title: resourceBindings?.tomtearealBeregnet?.title,
                          emptyFieldText: resourceBindings?.tomtearealBeregnet?.emptyFieldText
                      }
                  }
                : undefined,
            tomtearealByggeomraade: hasValue(arealdisponering?.tomtearealByggeomraade)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealByggeomraade
                      },
                      resourceBindings: {
                          title: resourceBindings?.tomtearealByggeomraade?.title,
                          emptyFieldText: resourceBindings?.tomtearealByggeomraade?.emptyFieldText
                      }
                  }
                : undefined,
            tomtearealSomTrekkesFra: hasValue(arealdisponering?.tomtearealSomTrekkesFra)
                ? {
                      resourceValues: {
                          data: arealdisponering?.tomtearealSomTrekkesFra
                      },
                      resourceBindings: {
                          title: resourceBindings?.tomtearealSomTrekkesFra?.title,
                          emptyFieldText: resourceBindings?.tomtearealSomTrekkesFra?.emptyFieldText
                      }
                  }
                : undefined
        };
        this.bebyggelsen = {
            arealBebyggelseEksisterende: hasValue(arealdisponering?.arealBebyggelseEksisterende)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseEksisterende
                      },
                      resourceBindings: {
                          title: resourceBindings?.arealBebyggelseEksisterende?.title,
                          emptyFieldText: resourceBindings?.arealBebyggelseEksisterende?.emptyFieldText
                      }
                  }
                : undefined,
            arealBebyggelseNytt: hasValue(arealdisponering?.arealBebyggelseNytt)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseNytt
                      },
                      resourceBindings: {
                          title: resourceBindings?.arealBebyggelseNytt?.title,
                          emptyFieldText: resourceBindings?.arealBebyggelseNytt?.emptyFieldText
                      }
                  }
                : undefined,
            arealBebyggelseSomSkalRives: hasValue(arealdisponering?.arealBebyggelseSomSkalRives)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealBebyggelseSomSkalRives
                      },
                      resourceBindings: {
                          title: resourceBindings?.arealBebyggelseSomSkalRives?.title,
                          emptyFieldText: resourceBindings?.arealBebyggelseSomSkalRives?.emptyFieldText
                      }
                  }
                : undefined,
            arealSumByggesak: hasValue(arealdisponering?.arealSumByggesak)
                ? {
                      resourceValues: {
                          data: arealdisponering?.arealSumByggesak
                      },
                      resourceBindings: {
                          title: resourceBindings?.arealSumByggesak?.title,
                          emptyFieldText: resourceBindings?.arealSumByggesak?.emptyFieldText
                      }
                  }
                : undefined,
            beregnetGradAvUtnytting: hasValue(arealdisponering?.beregnetGradAvUtnytting)
                ? {
                      resourceValues: {
                          data: arealdisponering?.beregnetGradAvUtnytting
                      },
                      resourceBindings: {
                          title: resourceBindings?.beregnetGradAvUtnytting?.title,
                          emptyFieldText: resourceBindings?.beregnetGradAvUtnytting?.emptyFieldText
                      }
                  }
                : undefined,
            beregnetMaksByggeareal: hasValue(arealdisponering?.beregnetMaksByggeareal)
                ? {
                      resourceValues: {
                          data: arealdisponering?.beregnetMaksByggeareal
                      },
                      resourceBindings: {
                          title: resourceBindings?.beregnetMaksByggeareal?.title,
                          emptyFieldText: resourceBindings?.beregnetMaksByggeareal?.emptyFieldText
                      }
                  }
                : undefined,
            parkeringsarealTerreng: hasValue(arealdisponering?.parkeringsarealTerreng)
                ? {
                      resourceValues: {
                          data: arealdisponering?.parkeringsarealTerreng
                      },
                      resourceBindings: {
                          title: resourceBindings?.parkeringsarealTerreng?.title,
                          emptyFieldText: resourceBindings?.parkeringsarealTerreng?.emptyFieldText
                      }
                  }
                : undefined
        };
    }
}
