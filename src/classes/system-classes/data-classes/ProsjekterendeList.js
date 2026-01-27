import { getTextResourceFromResourceBinding } from "../../../functions/helpers";

/**
 * Represents a list of "prosjekterende" (projecting entities) with their associated resource values.
 *
 * @class
 */
export default class ProsjekterendeList {
    constructor(prosjekterende, resourceBindings) {
        this.resourceValues = {
            data: this.getProsjekterendeItems(prosjekterende, resourceBindings)
        };
    }

    /**
     * Returns an array of text resources for the given prosjekterende object based on its approval statuses.
     *
     * @param {Object} prosjekterende - The object containing approval statuses for different permit types.
     * @param {Object} resourceBindings - An object containing resource bindings for each permit type.
     * @param {Object} [resourceBindings.Rammetillatelse] - Resource binding for "Rammetillatelse".
     * @param {Object} [resourceBindings.Igangsettingstillatelse] - Resource binding for "Igangsettingstillatelse".
     * @param {Object} [resourceBindings.MidlertidigBrukstillatelse] - Resource binding for "MidlertidigBrukstillatelse".
     * @param {Object} [resourceBindings.Ferdigattest] - Resource binding for "Ferdigattest".
     * @returns {Array<string>} An array of text resources for the approved permit types.
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
