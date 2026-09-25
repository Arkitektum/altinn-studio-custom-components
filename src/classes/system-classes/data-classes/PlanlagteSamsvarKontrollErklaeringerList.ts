import type { KodeProps } from "../../data-classes/Kode.ts";
import type { TitleResourceBinding } from "../../../types.ts";
// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/** Which control declarations are planned and which have been signed, as the form data holds them. */
export interface PlanlagteSamsvarKontrollErklaeringerProps {
    samsvarKontrollPlanlagtVedRammetillatelse?: boolean;
    samsvarKontrollPlanlagtVedIgangsettingstillatelse?: boolean;
    samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?: boolean;
    samsvarKontrollPlanlagtVedFerdigattest?: boolean;
    samsvarKontrollForeliggerVedRammetillatelse?: string | null;
    samsvarKontrollForeliggerVedIgangsettingstillatelse?: string | null;
    samsvarKontrollForeliggerVedMidlertidigBrukstillatelse?: string | null;
    samsvarKontrollForeliggerVedFerdigattest?: string | null;
    /** Decides which of the two empty-field texts an unsigned declaration is shown with. */
    ansvarsomraadeStatus?: KodeProps | null;
}

/** The two texts an unsigned declaration can be shown with, one per state of the responsibility area. */
export interface EmptySigningDateResourceBinding {
    emptyFieldText?: string;
    emptyFieldTextAvsluttet?: string;
}

/** One binding per permit stage, plus the pair of empty-field texts the stages share. */
export interface PlanlagteSamsvarKontrollErklaeringerResourceBindings {
    samsvarKontrollPlanlagtVedRammetillatelse?: TitleResourceBinding;
    samsvarKontrollPlanlagtVedIgangsettingstillatelse?: TitleResourceBinding;
    samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse?: TitleResourceBinding;
    samsvarKontrollPlanlagtVedFerdigattest?: TitleResourceBinding;
    planlagteSamsvarKontrollErklaeringer?: EmptySigningDateResourceBinding;
}

/** The signing date of one declaration, or the text that stands in for it when it has not been signed. */
export interface SigningDateData {
    data?: string | null;
    /** Set only when there is a date to format, which is what tells the two apart. */
    format?: string;
}

/** One planned declaration, as the list that renders them is handed it. */
export interface PlanlagtSamsvarKontrollErklaering {
    title: { data?: string };
    signingDate: SigningDateData;
}

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
    declare resourceValues: { data: PlanlagtSamsvarKontrollErklaering[] };

    constructor(
        props?: PlanlagteSamsvarKontrollErklaeringerProps | null,
        resourceBindings?: PlanlagteSamsvarKontrollErklaeringerResourceBindings
    ) {
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
    getEmptySigningDateFieldText(
        ansvarsomraadeStatus?: KodeProps | null,
        resourceBindings?: PlanlagteSamsvarKontrollErklaeringerResourceBindings
    ): string | undefined {
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
    getSigningDateData(
        signingDate?: string | null,
        ansvarsomraadeStatus?: KodeProps | null,
        resourceBindings?: PlanlagteSamsvarKontrollErklaeringerResourceBindings
    ): SigningDateData {
        const signingDateData = hasValue(signingDate)
            ? { data: signingDate, format: "date" }
            : { data: this.getEmptySigningDateFieldText(ansvarsomraadeStatus, resourceBindings) };
        return signingDateData;
    }

    /**
     * Generates a list of planned conformity control declarations based on the provided properties and resource bindings.
     *
     * Each item in the returned list represents a planned conformity control declaration for a specific permit stage,
     * including its title and signing date information. Only stages that are either explicitly planned or have a value
     * for their corresponding "foreligger" property are included.
     *
     * @param {Object} props - The properties containing flags and values for each permit stage.
     * @param {Object} resourceBindings - The resource bindings used to retrieve localized text resources for titles.
     * @returns {Array<Object>} An array of objects, each containing:
     *   - {Object} title: The title object with a localized data property.
     *   - {Object} signingDate: The signing date data as returned by `getSigningDateData`.
     */
    getPlanlagteSamsvarKontrollErklaeringerList(
        props?: PlanlagteSamsvarKontrollErklaeringerProps | null,
        resourceBindings?: PlanlagteSamsvarKontrollErklaeringerResourceBindings
    ): PlanlagtSamsvarKontrollErklaering[] {
        // The cast records what the filter leaves behind, which the type system does not track.
        return [
            props?.samsvarKontrollPlanlagtVedRammetillatelse === true || hasValue(props?.samsvarKontrollForeliggerVedRammetillatelse)
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse?.title) },
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedRammetillatelse,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedIgangsettingstillatelse === true || hasValue(props?.samsvarKontrollForeliggerVedIgangsettingstillatelse)
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse?.title) },
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedIgangsettingstillatelse,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null,
            props?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse === true ||
            hasValue(props?.samsvarKontrollForeliggerVedMidlertidigBrukstillatelse)
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
            props?.samsvarKontrollPlanlagtVedFerdigattest === true || hasValue(props?.samsvarKontrollForeliggerVedFerdigattest)
                ? {
                      title: { data: getTextResourceFromResourceBinding(resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest?.title) },
                      signingDate: this.getSigningDateData(
                          props?.samsvarKontrollForeliggerVedFerdigattest,
                          props?.ansvarsomraadeStatus,
                          resourceBindings
                      )
                  }
                : null
        ].filter((item) => item !== null) as PlanlagtSamsvarKontrollErklaering[];
    }
}
