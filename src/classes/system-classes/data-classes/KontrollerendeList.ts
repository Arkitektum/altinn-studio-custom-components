import type { TitleResourceBinding } from "../../../types.ts";
// Dependencies
import { getTextResourceFromResourceBinding } from "@arkitektum/altinn-studio-custom-components-utils";

/** Which kinds of deviation a control found, as the form data flags them. */
export interface KontrollerendeProps {
    harObserverteAvvik?: boolean;
    harAapneAvvik?: boolean;
    harIngenAvvik?: boolean;
}

/** One binding per kind of deviation, naming the text resource it is shown as. */
export interface KontrollerendeResourceBindings {
    harObserverteAvvik?: TitleResourceBinding;
    harAapneAvvik?: TitleResourceBinding;
    harIngenAvvik?: TitleResourceBinding;
}

/**
 * Creates an instance of KontrollerendeList.
 * @param {any} kontrollerende - The kontrollerende data used to generate items.
 * @param {any} resourceBindings - Resource bindings used for item generation.
 */
export default class KontrollerendeList {
    declare resourceValues: { data: (string | undefined)[] };

    constructor(kontrollerende?: KontrollerendeProps | null, resourceBindings?: KontrollerendeResourceBindings) {
        this.resourceValues = { data: this.getKontrollerendeItems(kontrollerende, resourceBindings) };
    }

    /**
     * Returns an array of text resources based on the properties of the provided `kontrollerende` object.
     * For each property (`harObserverteAvvik`, `harAapneAvvik`, `harIngenAvvik`) that is `true`,
     * the corresponding text resource is retrieved from the `resourceBindings` object.
     * Null values are filtered out from the result.
     *
     * @param {Object} kontrollerende - The object containing boolean flags indicating the presence of different types of deviations.
     * @param {Object} resourceBindings - The object containing resource bindings for each deviation type.
     * @param {Object} [resourceBindings.harObserverteAvvik] - Resource binding for observed deviations.
     * @param {Object} [resourceBindings.harAapneAvvik] - Resource binding for open deviations.
     * @param {Object} [resourceBindings.harIngenAvvik] - Resource binding for no deviations.
     * @returns {Array<string>} An array of text resources corresponding to the true properties in `kontrollerende`.
     */
    getKontrollerendeItems(kontrollerende?: KontrollerendeProps | null, resourceBindings?: KontrollerendeResourceBindings): (string | undefined)[] {
        // The cast records what the filter leaves behind, which the type system does not track.
        return [
            kontrollerende?.harObserverteAvvik === true ? getTextResourceFromResourceBinding(resourceBindings?.harObserverteAvvik?.title) : null,
            kontrollerende?.harAapneAvvik === true ? getTextResourceFromResourceBinding(resourceBindings?.harAapneAvvik?.title) : null,
            kontrollerende?.harIngenAvvik === true ? getTextResourceFromResourceBinding(resourceBindings?.harIngenAvvik?.title) : null
        ].filter((item) => item !== null) as (string | undefined)[];
    }
}
