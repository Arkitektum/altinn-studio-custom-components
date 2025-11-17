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
     * Generates a list of planned compliance control declarations based on provided properties and resource bindings.
     *
     * Each item in the returned list represents a planned compliance control declaration for a specific permit stage,
     * including its title (localized using resource bindings) and signing date (formatted as "date").
     * Only stages marked as planned (`true`) in the `props` object are included.
     *
     * @param {Object} props - The properties indicating which compliance controls are planned and their signing dates.
     * @param {Object} resourceBindings - The resource bindings used to localize the titles for each compliance control stage.
     * @returns {Array<Object>} An array of objects, each containing a `title` and `signingDate` for a planned compliance control declaration.
     */
    getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings) {
        return [
            props?.samsvarKontrollPlanlagtVedRammetillatelse === true
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse?.title) },
                      signingDate: { data: props?.samsvarKontrollForeliggerVedRammetillatelse, format: "date" }
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedIgangsettingstillatelse === true
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse?.title) },
                      signingDate: { data: props?.samsvarKontrollForeliggerVedIgangsettingstillatelse, format: "date" }
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse === true
                ? {
                      title: {
                          data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?.title)
                      },
                      signingDate: { data: props?.samsvarKontrollForeliggerVedMidlertidigBrukstillatelse, format: "date" }
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedFerdigattest === true
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest?.title) },
                      signingDate: { data: props?.samsvarKontrollForeliggerVedFerdigattest, format: "date" }
                  }
                : null
        ].filter((item) => item !== null);
    }
}
