import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Constructs a new instance of the ProsjekterendeList class.
 *
 * Initializes the resourceValues property based on the provided funksjonKodeverdi.
 * Depending on the value of funksjonKodeverdi ("PRO" or "UTF"), it calls the corresponding method
 * to retrieve items for prosjekterende using the provided resourceBindings.
 *
 * @param {string} funksjonKodeverdi - The function code value determining which items to retrieve ("PRO" or "UTF").
 * @param {*} prosjekterende - The prosjekterende data to be used for item retrieval.
 * @param {*} resourceBindings - The resource bindings used in item retrieval methods.
 */
export default class ProsjekterendeList {
    constructor(funksjonKodeverdi, prosjekterende, resourceBindings) {
        let data;

        switch (funksjonKodeverdi.toUpperCase()) {
            case "PRO":
                data = this.getPROProsjekterendeItems(prosjekterende, resourceBindings);
                break;

            case "UTF":
                data = this.getUTFProsjekterendeItems(prosjekterende, resourceBindings);
                break;

            default:
                data = [];
        }

        this.resourceValues = { data };
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
    getPROProsjekterendeItems(prosjekterende, resourceBindings) {
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

    getUTFProsjekterendeItems(prosjekterende, resourceBindings) {
        return [
            prosjekterende?.erOkForMidlertidigBrukstillatelse === true
                ? getTextResourceFromResourceBinding(resourceBindings?.MidlertidigBrukstillatelse?.title)
                : null,
            prosjekterende?.erOkForFerdigattest === true ? getTextResourceFromResourceBinding(resourceBindings?.Ferdigattest?.title) : null
        ].filter((item) => item !== null);
    }
}
