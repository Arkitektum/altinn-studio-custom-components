import type { TitleResourceBinding } from "../../../types.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * The area figures a summation reads, which is what the Arealdisponering model holds.
 *
 * Named here rather than taken from that model so the summation accepts an instance of it as readily as the raw
 * form data.
 */
export interface ArealdisponeringSummationProps {
    beregnetMaksByggeareal?: number | null;
    arealBebyggelseEksisterende?: number | null;
    arealBebyggelseSomSkalRives?: number | null;
    arealBebyggelseNytt?: number | null;
    parkeringsarealTerreng?: number | null;
    arealSumByggesak?: number | null;
    tomtearealByggeomraade?: number | null;
    tomtearealSomLeggesTil?: number | null;
    tomtearealSomTrekkesFra?: number | null;
    tomtearealBeregnet?: number | null;
}

/** The bindings one summed field carries, which is whatever the component that renders the field names. */
export type ArealdisponeringFieldBinding = Record<string, string>;

/** The headings of the two groups, and one binding per field under them. */
export interface ArealdisponeringResourceBindings {
    tomtearealet?: TitleResourceBinding;
    bebyggelsen?: TitleResourceBinding;
    beregnetMaksByggeareal?: ArealdisponeringFieldBinding;
    arealBebyggelseEksisterende?: ArealdisponeringFieldBinding;
    arealBebyggelseSomSkalRives?: ArealdisponeringFieldBinding;
    arealBebyggelseNytt?: ArealdisponeringFieldBinding;
    parkeringsarealTerreng?: ArealdisponeringFieldBinding;
    arealSumByggesak?: ArealdisponeringFieldBinding;
    tomtearealByggeomraade?: ArealdisponeringFieldBinding;
    tomtearealSomLeggesTil?: ArealdisponeringFieldBinding;
    tomtearealSomTrekkesFra?: ArealdisponeringFieldBinding;
    tomtearealBeregnet?: ArealdisponeringFieldBinding;
}

/** One summed field, as the table that renders the summation is handed it. */
export interface ArealdisponeringSummationItem {
    resourceValues: {
        data?: number | null;
        /** True for the one field that is the sum of the others, which is how the table sets it apart. */
        isTotal: boolean;
    };
    /** Absent when the caller named no binding for the field, which is what the table then renders without. */
    resourceBindings?: ArealdisponeringFieldBinding;
}

/** One group of summed fields: its heading, and the fields that have a value. */
export interface ArealdisponeringSummationGroup {
    resourceBindings: TitleResourceBinding;
    resourceValues: { data: ArealdisponeringSummationItem[] };
}

/**
 * Class representing a summation of area disposition.
 * @class
 */
export default class ArealdisponeringSummation {
    declare tomtearealet: ArealdisponeringSummationGroup;
    declare bebyggelsen: ArealdisponeringSummationGroup;

    constructor(arealdisponering?: ArealdisponeringSummationProps | null, resourceBindings?: ArealdisponeringResourceBindings) {
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
    getBebyggelsenItems(
        arealdisponering?: ArealdisponeringSummationProps | null,
        resourceBindings?: ArealdisponeringResourceBindings
    ): ArealdisponeringSummationItem[] {
        // The cast records what the filter leaves behind, which the type system does not track.
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
        ].filter((item) => item !== null) as ArealdisponeringSummationItem[];
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
    getTomtearealetItems(
        arealdisponering?: ArealdisponeringSummationProps | null,
        resourceBindings?: ArealdisponeringResourceBindings
    ): ArealdisponeringSummationItem[] {
        // The cast records what the filter leaves behind, which the type system does not track.
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
        ].filter((item) => item !== null) as ArealdisponeringSummationItem[];
    }
}
