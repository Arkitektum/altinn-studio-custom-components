import type { TitleResourceBinding } from "../../../types.ts";
// Dependencies
import { getTextResourceFromResourceBinding } from "@arkitektum/altinn-studio-custom-components-utils";

/** Which permits the design work is signed off for, as the form data flags them. */
export interface ProsjekterendeProps {
    erOkForRammetillatelse?: boolean;
    erOkForIgangsettingstillatelse?: boolean;
    erOkForMidlertidigBrukstillatelse?: boolean;
    erOkForFerdigattest?: boolean;
}

/** One binding per permit, naming the text resource it is shown as. */
export interface ProsjekterendeResourceBindings {
    rammetillatelse?: TitleResourceBinding;
    igangsettingstillatelse?: TitleResourceBinding;
    midlertidigBrukstillatelse?: TitleResourceBinding;
    ferdigattest?: TitleResourceBinding;
}

/**
 * Constructs a new instance of the class.
 * Initializes the resourceValues property with data obtained from getProsjekterendeItems.
 *
 * @param {any} prosjekterende - The prosjekterende data to be processed.
 * @param {any} resourceBindings - The resource bindings used for processing prosjekterende items.
 */
export default class ProsjekterendeList {
    declare resourceValues: { data: (string | undefined)[] };

    constructor(prosjekterende?: ProsjekterendeProps | null, resourceBindings?: ProsjekterendeResourceBindings) {
        this.resourceValues = { data: this.getProsjekterendeItems(prosjekterende, resourceBindings) };
    }

    /**
     * Returns a filtered list of text resources based on the properties of the given `prosjekterende` object.
     * For each property (`erOkForRammetillatelse`, `erOkForIgangsettingstillatelse`,
     * `erOkForMidlertidigBrukstillatelse`, `erOkForFerdigattest`) that is `true`,
     * the corresponding text resource is retrieved from `resourceBindings`.
     *
     * @param {Object} prosjekterende - The object containing boolean flags for different permissions.
     * @param {Object} resourceBindings - An object containing resource bindings for each permission type.
     * @param {Object} [resourceBindings.rammetillatelse] - Resource binding for "Rammetillatelse".
     * @param {Object} [resourceBindings.igangsettingstillatelse] - Resource binding for "Igangsettingstillatelse".
     * @param {Object} [resourceBindings.midlertidigBrukstillatelse] - Resource binding for "MidlertidigBrukstillatelse".
     * @param {Object} [resourceBindings.ferdigattest] - Resource binding for "Ferdigattest".
     * @returns {Array<string>} An array of text resources for the permissions that are set to `true`.
     */
    getProsjekterendeItems(prosjekterende?: ProsjekterendeProps | null, resourceBindings?: ProsjekterendeResourceBindings): (string | undefined)[] {
        // The cast records what the filter leaves behind, which the type system does not track.
        return [
            prosjekterende?.erOkForRammetillatelse === true ? getTextResourceFromResourceBinding(resourceBindings?.rammetillatelse?.title) : null,
            prosjekterende?.erOkForIgangsettingstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.igangsettingstillatelse?.title)
                : null,
            prosjekterende?.erOkForMidlertidigBrukstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.midlertidigBrukstillatelse?.title)
                : null,
            prosjekterende?.erOkForFerdigattest === true ? getTextResourceFromResourceBinding(resourceBindings?.ferdigattest?.title) : null
        ].filter((item) => item !== null) as (string | undefined)[];
    }
}
