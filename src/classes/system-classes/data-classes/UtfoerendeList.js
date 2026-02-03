import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Constructs an instance of the class and initializes resource values.
 *
 * @param {boolean} erOkForFerdigattest - Indicates if the item is approved for final certification.
 * @param {boolean} erOkForMidlertidigBrukstillatelse - Indicates if the item is approved for temporary use permit.
 * @param {Object} resourceBindings - Resource bindings used to generate the list of items.
 */
export default class UtfoerendeList {
    constructor(erOkForFerdigattest, erOkForMidlertidigBrukstillatelse, resourceBindings) {
        this.resourceValues = { data: this.getUtfoerendeItems(erOkForFerdigattest, erOkForMidlertidigBrukstillatelse, resourceBindings) };
    }

    /**
     * Returns an array of text resources based on the provided boolean flags and resource bindings.
     *
     * @param {boolean} erOkForFerdigattest - Indicates if the item is valid for "Ferdigattest".
     * @param {boolean} erOkForMidlertidigBrukstillatelse - Indicates if the item is valid for "Midlertidig Brukstillatelse".
     * @param {Object} resourceBindings - An object containing resource bindings for text resources.
     * @param {Object} [resourceBindings.midlertidigBrukstillatelse] - Resource binding for "Midlertidig Brukstillatelse".
     * @param {Object} [resourceBindings.ferdigattest] - Resource binding for "Ferdigattest".
     * @returns {Array<string>} An array of text resources, filtered to exclude null values.
     */
    getUtfoerendeItems(erOkForFerdigattest, erOkForMidlertidigBrukstillatelse, resourceBindings) {
        return [
            erOkForMidlertidigBrukstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.midlertidigBrukstillatelse?.title)
                : null,
            erOkForFerdigattest === true ? getTextResourceFromResourceBinding(resourceBindings?.ferdigattest?.title) : null
        ].filter((item) => item !== null);
    }
}
