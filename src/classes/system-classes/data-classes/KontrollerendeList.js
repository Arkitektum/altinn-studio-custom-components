import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Creates an instance of KontrollerendeList.
 * @param {any} kontrollerende - The kontrollerende data used to generate items.
 * @param {any} resourceBindings - Resource bindings used for item generation.
 */
export default class KontrollerendeList {
    constructor(kontrollerende, resourceBindings) {
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
    getKontrollerendeItems(kontrollerende, resourceBindings) {
        return [
            kontrollerende?.harObserverteAvvik === true ? getTextResourceFromResourceBinding(resourceBindings?.harObserverteAvvik?.title) : null,
            kontrollerende?.harAapneAvvik === true ? getTextResourceFromResourceBinding(resourceBindings?.harAapneAvvik?.title) : null,
            kontrollerende?.harIngenAvvik === true ? getTextResourceFromResourceBinding(resourceBindings?.harIngenAvvik?.title) : null
        ].filter((item) => item !== null);
    }
}
