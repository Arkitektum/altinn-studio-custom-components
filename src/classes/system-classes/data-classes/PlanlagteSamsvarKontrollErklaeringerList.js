// Global functions
import { getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

/**
 * Class representing a list of planned compliance control declarations.
 *
 * This class provides methods to generate and format a list of planned compliance control declarations
 * based on provided properties and resource bindings. It includes logic to handle empty signing date fields
 * and to localize titles using resource bindings.
 *
 * @class
 */
export default class PlanlagteSamsvarKontrollErklaeringerList {
    constructor(props, resourceBindings) {
        this.resourceValues = {
            data: this.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)
        };
    }

    /**
     * Returns the appropriate text for an empty signing date field based on the status of the responsibility area.
     *
     * @param {Object} ansvarsomraadeStatus - The status object of the responsibility area, expected to have a `kodeverdi` property.
     * @param {Object} resourceBindings - An object containing resource bindings for text resources.
     * @returns {string} The text resource for the empty signing date field, depending on whether the status is "avsluttet" or not.
     */
    getEmptySigningDateFieldText(ansvarsomraadeStatus, resourceBindings) {
        return ansvarsomraadeStatus?.kodeverdi === "avsluttet"
            ? getTextResourceFromResourceBinding(resourceBindings?.planlagteSamsvarKontrollErklaeringer?.emptyFieldTextAvsluttet)
            : getTextResourceFromResourceBinding(resourceBindings?.planlagteSamsvarKontrollErklaeringer?.emptyFieldText);
    }

    /**
     * Returns an object containing signing date data or a placeholder text if the signing date is not provided.
     *
     * @param {*} signingDate - The signing date value to check.
     * @param {*} ansvarsomraadeStatus - The status of the responsibility area, used if signing date is missing.
     * @param {*} resourceBindings - Resource bindings used to generate the empty field text.
     * @returns {{ data: *, format?: string }} An object with the signing date and optional format, or a placeholder text.
     */
    getSigningDateData(signingDate, ansvarsomraadeStatus, resourceBindings) {
        const signingDateData = hasValue(signingDate)
            ? { data: signingDate, format: "date" }
            : { data: this.getEmptySigningDateFieldText(ansvarsomraadeStatus, resourceBindings) };
        return signingDateData;
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
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedRammetillatelse,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedIgangsettingstillatelse === true
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse?.title) },
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedIgangsettingstillatelse,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse === true
                ? {
                      title: {
                          data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?.title)
                      },
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedMidlertidigBrukstillatelse,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedFerdigattest === true
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest?.title) },
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedFerdigattest,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null
        ].filter((item) => item !== null);
    }
}
