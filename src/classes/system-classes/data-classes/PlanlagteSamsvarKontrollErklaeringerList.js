// Global functions
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

/**
 * Represents a list of planned conformity control declarations for various permit stages.
 *
 * @class
 * @classdesc
 * This class generates a list of planned conformity control declarations based on provided properties and resource bindings.
 * Each item in the list contains a localized title and an optional signing date, included only if the stage is marked as planned.
 *
 * @param {Object} props - Properties indicating which conformity controls are planned and their signing dates.
 * @param {Object} resourceBindings - Resource bindings used to retrieve localized titles for each stage.
 *
 * @property {Object} resourceValues - Contains the generated list of planned conformity control declarations.
 * @property {Array<Object>} resourceValues.data - The array of planned conformity control declaration objects.
 *
 * @method getPlanlagteSamsvarKontrollErklaeringerList
 * @param {Object} props - The properties indicating which conformity controls are planned and their signing dates.
 * @param {Object} resourceBindings - The resource bindings used to retrieve localized titles for each stage.
 * @returns {Array<Object>} An array of objects, each containing:
 *   - {string} title: The localized title of the planned conformity control declaration.
 *   - {string|undefined} signingDate: The signing date for the declaration, if available.
 */
export default class PlanlagteSamsvarKontrollErklaeringerList {
    constructor(props, resourceBindings) {
        this.resourceValues = {
            data: this.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)
        };
    }

    /**
     * Generates a list of planned conformity control declarations based on the provided properties and resource bindings.
     *
     * Each item in the returned list represents a planned conformity control declaration for a specific permit stage,
     * including its title (localized via resource bindings) and signing date (if available).
     * Only stages marked as planned (`true`) in the `props` object are included.
     *
     * @param {Object} props - The properties indicating which conformity controls are planned and their signing dates.
     * @param {Object} resourceBindings - The resource bindings used to retrieve localized titles for each stage.
     * @returns {Array<Object>} An array of objects, each containing:
     *   - {string} title: The localized title of the planned conformity control declaration.
     *   - {string|undefined} signingDate: The signing date for the declaration, if available.
     */
    getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings) {
        return [
            props?.samsvarKontrollPlanlagtVedRammetillatelse === true
                ? {
                      title: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse?.title),
                      signingDate: props?.samsvarKontrollForeliggerVedRammetillatelse
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedIgangsettingstillatelse === true
                ? {
                      title: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse?.title),
                      signingDate: props?.samsvarKontrollForeliggerVedIgangsettingstillatelse
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse === true
                ? {
                      title: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?.title),
                      signingDate: props?.samsvarKontrollForeliggerVedMidlertidigBrukstillatelse
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedFerdigattest === true
                ? {
                      title: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest?.title),
                      signingDate: props?.samsvarKontrollForeliggerVedFerdigattest
                  }
                : null
        ].filter((item) => item !== null);
    }
}
