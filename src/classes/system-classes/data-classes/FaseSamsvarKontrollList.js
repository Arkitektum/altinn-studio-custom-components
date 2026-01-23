// Global functions
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Represents a list of "samsvar kontroll" phases with their corresponding text resources.
 *
 * @class
 * @classdesc
 * The FaseSamsvarKontrollList class processes a set of boolean flags indicating which "samsvar kontroll" phases are active,
 * and maps them to their corresponding text resources using provided resource bindings.
 *
 * @param {Object} faseSamsvarKontroll - An object containing boolean flags for each samsvar kontroll phase.
 * @param {Object} resourceBindings - An object containing resource bindings for each phase, each with a `title` property.
 *
 * @property {Object} resourceValues - Contains the resulting array of text resources under the `data` property.
 */
export default class FaseSamsvarKontrollList {
    constructor(faseSamsvarKontroll, resourceBindings) {
        this.resourceValues = {
            data: this.getFaseSamsvarKontrollItems(faseSamsvarKontroll, resourceBindings)
        };
    }

    /**
     * Returns an array of text resources for each phase of "samsvar kontroll" that is set to true.
     *
     * @param {Object} faseSamsvarKontroll - An object containing boolean flags for each samsvar kontroll phase.
     * @param {Object} resourceBindings - An object containing resource bindings for each phase, with a `title` property.
     * @returns {string[]} An array of text resources corresponding to the phases where the flag is true.
     */
    getFaseSamsvarKontrollItems(faseSamsvarKontroll, resourceBindings) {
        return [
            faseSamsvarKontroll?.harSamsvarKontrollVedRammetillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.harSamsvarKontrollVedRammetillatelse?.title)
                : null,
            faseSamsvarKontroll?.harSamsvarKontrollVedIgangsettingstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.harSamsvarKontrollVedIgangsettingstillatelse?.title)
                : null,
            faseSamsvarKontroll?.harSamsvarKontrollVedMidlertidigBrukstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.harSamsvarKontrollVedMidlertidigBrukstillatelse?.title)
                : null,
            faseSamsvarKontroll?.harSamsvarKontrollVedFerdigattest === true
                ? getTextResourceFromResourceBinding(resourceBindings?.harSamsvarKontrollVedFerdigattest?.title)
                : null
        ].filter((item) => item !== null);
    }
}
