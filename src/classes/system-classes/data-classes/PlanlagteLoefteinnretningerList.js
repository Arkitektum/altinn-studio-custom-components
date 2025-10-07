// Global functions
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Represents a list of planned lift device items.
 *
 * @class
 * @classdesc This class processes a set of boolean flags indicating which lift devices are planned,
 * and maps them to their corresponding text resources using provided resource bindings.
 *
 * @param {Object} loefteinnretninger - An object containing boolean flags for each planned lift device type.
 * @param {Object} resourceBindings - An object containing resource bindings for each lift device type.
 *
 * @property {Object} resourceValues - Contains the filtered list of planned lift device items as text resources.
 *
 * @method getPlanlagteLoefteinnretningItems
 * @param {Object} loefteinnretninger - An object containing boolean flags for planned lift devices.
 * @param {Object} resourceBindings - An object containing resource bindings for each lift device type.
 * @returns {Array<string>} An array of text resources for the planned lift devices.
 */
export default class PlanlagteLoefteinnretningerList {
    constructor(loefteinnretninger, resourceBindings) {
        this.resourceValues = {
            data: this.getPlanlagteLoefteinnretningItems(loefteinnretninger, resourceBindings)
        };
    }

    /**
     * Returns a filtered list of planned lift device items based on the provided `loefteinnretninger` object.
     * Each item is retrieved from the corresponding resource binding if the related property is `true`.
     *
     * @param {Object} loefteinnretninger - An object containing boolean flags for planned lift devices.
     * @param {Object} resourceBindings - An object containing resource bindings for each lift device type.
     * @returns {Array<string>} An array of text resources for the planned lift devices.
     */
    getPlanlagteLoefteinnretningItems(loefteinnretninger, resourceBindings) {
        return [
            loefteinnretninger?.planleggesHeis === true ? getTextResourceFromResourceBinding(resourceBindings?.planleggesHeis?.title) : null,
            loefteinnretninger?.planleggesLoefteplattform === true
                ? getTextResourceFromResourceBinding(resourceBindings?.planleggesLoefteplattform?.title)
                : null,
            loefteinnretninger?.planleggesRulletrapp === true
                ? getTextResourceFromResourceBinding(resourceBindings?.planleggesRulletrapp?.title)
                : null,
            loefteinnretninger?.planleggesTrappeheis === true
                ? getTextResourceFromResourceBinding(resourceBindings?.planleggesTrappeheis?.title)
                : null
        ].filter((item) => item !== null);
    }
}
