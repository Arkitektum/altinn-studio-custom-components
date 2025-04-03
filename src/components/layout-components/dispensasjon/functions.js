import Dispensasjon from "../../../classes/layout-classes/Dispensasjon.js";
import { hasValue } from "../../../functions/helpers.js";

/**
 * Retrieves a Dispensasjon instance if the provided component has valid form data.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} [component.formData] - The form data of the component.
 * @returns {Dispensasjon|boolean} A new Dispensasjon instance if the form data is valid, otherwise `false`.
 */
export function getDispensasjon(component) {
    return hasValue(component?.formData) && new Dispensasjon(component.formData);
}

/**
 * Checks if the given dispensasjon object has a bestemmelserType code description
 * that matches one of the predefined plan bestemmelse types.
 *
 * @param {Object} dispensasjon - The dispensasjon object to check.
 * @param {Object} [dispensasjon.dispensasjonFra] - The object containing details about the dispensasjon.
 * @param {Object} [dispensasjon.dispensasjonFra.bestemmelserType] - The object containing the type of bestemmelse.
 * @param {string} [dispensasjon.dispensasjonFra.bestemmelserType.kodebeskrivelse] - The code description of the bestemmelse type.
 * @returns {boolean} - Returns true if the code description matches one of the predefined plan bestemmelse types, otherwise false.
 */
export function dispensasjonIsPlanBestemmelseType(dispensasjon) {
    const planBestemmelseTypeValues = ["reguleringsplan", "kommuneplan", "kommunedelplan"];
    return planBestemmelseTypeValues.includes(dispensasjon?.dispensasjonFra?.bestemmelserType?.kodebeskrivelse?.toLowerCase());
}
