import type { TitleResourceBinding } from "../../../types.ts";
// Dependencies
import { getTextResourceFromResourceBinding } from "@arkitektum/altinn-studio-custom-components-utils";

/** Which phases a samsvar kontroll covers, as the form data flags them. */
export interface FaseSamsvarKontrollProps {
    harSamsvarKontrollVedRammetillatelse?: boolean;
    harSamsvarKontrollVedIgangsettingstillatelse?: boolean;
    harSamsvarKontrollVedMidlertidigBrukstillatelse?: boolean;
    harSamsvarKontrollVedFerdigattest?: boolean;
}

/** One binding per phase, naming the text resource that phase is shown as. */
export interface FaseSamsvarKontrollResourceBindings {
    rammetillatelse?: TitleResourceBinding;
    igangsettingstillatelse?: TitleResourceBinding;
    midlertidigBrukstillatelse?: TitleResourceBinding;
    ferdigattest?: TitleResourceBinding;
}

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
    declare resourceValues: { data: (string | undefined)[] };

    constructor(faseSamsvarKontroll?: FaseSamsvarKontrollProps | null, resourceBindings?: FaseSamsvarKontrollResourceBindings) {
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
    getFaseSamsvarKontrollItems(
        faseSamsvarKontroll?: FaseSamsvarKontrollProps | null,
        resourceBindings?: FaseSamsvarKontrollResourceBindings
    ): (string | undefined)[] {
        // The cast records what the filter leaves behind, which the type system does not track.
        return [
            faseSamsvarKontroll?.harSamsvarKontrollVedRammetillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.rammetillatelse?.title)
                : null,
            faseSamsvarKontroll?.harSamsvarKontrollVedIgangsettingstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.igangsettingstillatelse?.title)
                : null,
            faseSamsvarKontroll?.harSamsvarKontrollVedMidlertidigBrukstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.midlertidigBrukstillatelse?.title)
                : null,
            faseSamsvarKontroll?.harSamsvarKontrollVedFerdigattest === true
                ? getTextResourceFromResourceBinding(resourceBindings?.ferdigattest?.title)
                : null
        ].filter((item) => item !== null) as (string | undefined)[];
    }
}
