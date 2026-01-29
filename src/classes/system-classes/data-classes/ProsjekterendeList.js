import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Constructs a new instance of the class.
 * Initializes the resourceValues property with data obtained from getProsjekterendeItems.
 *
 * @param {any} prosjekterende - The prosjekterende data to be processed.
 * @param {any} resourceBindings - The resource bindings used for processing prosjekterende items.
 */
export default class ProsjekterendeList {
    constructor(prosjekterende, resourceBindings) {
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
     * @param {Object} [resourceBindings.Rammetillatelse] - Resource binding for "Rammetillatelse".
     * @param {Object} [resourceBindings.Igangsettingstillatelse] - Resource binding for "Igangsettingstillatelse".
     * @param {Object} [resourceBindings.MidlertidigBrukstillatelse] - Resource binding for "MidlertidigBrukstillatelse".
     * @param {Object} [resourceBindings.Ferdigattest] - Resource binding for "Ferdigattest".
     * @returns {Array<string>} An array of text resources for the permissions that are set to `true`.
     */
    getProsjekterendeItems(prosjekterende, resourceBindings) {
        return [
            prosjekterende?.erOkForRammetillatelse === true ? getTextResourceFromResourceBinding(resourceBindings?.Rammetillatelse?.title) : null,
            prosjekterende?.erOkForIgangsettingstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.Igangsettingstillatelse?.title)
                : null,
            prosjekterende?.erOkForMidlertidigBrukstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.MidlertidigBrukstillatelse?.title)
                : null,
            prosjekterende?.erOkForFerdigattest === true ? getTextResourceFromResourceBinding(resourceBindings?.Ferdigattest?.title) : null
        ].filter((item) => item !== null);
    }
}
