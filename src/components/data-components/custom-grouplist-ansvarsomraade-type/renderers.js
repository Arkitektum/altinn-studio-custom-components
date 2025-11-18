// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Returns a formatted title for an "ansvarsomraade" object based on its "funksjon" properties.
 * If both "kodebeskrivelse" and "kodeverdi" are present, returns "kodebeskrivelse (kodeverdi)".
 * If only one is present, returns that value. If neither is present, returns "Ukjent funksjon".
 *
 * @param {Object} ansvarsomraade - The object containing "funksjon" details.
 * @param {Object} [ansvarsomraade.funksjon] - The function details.
 * @param {string} [ansvarsomraade.funksjon.kodebeskrivelse] - The description of the function.
 * @param {string} [ansvarsomraade.funksjon.kodeverdi] - The code value of the function.
 * @returns {string} The formatted title for the ansvarsomraade.
 */
function getAnsvarsomraadeTitle(ansvarsomraade) {
    const kodebeskrivelse = ansvarsomraade?.funksjon?.kodebeskrivelse;
    const kodeverdi = ansvarsomraade?.funksjon?.kodeverdi;
    if (kodebeskrivelse && kodeverdi) {
        return `${kodebeskrivelse} (${kodeverdi})`;
    } else if (kodebeskrivelse) {
        return kodebeskrivelse;
    } else if (kodeverdi) {
        return kodeverdi;
    }
    return "Ukjent funksjon";
}

/**
 * Renders a custom table element for a specific "ansvarsomraade type".
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {string} ansvarsomraadeTypeKey - The key used to access the specific "ansvarsomraade type" data.
 * @returns {HTMLElement} The custom table element representing the "ansvarsomraade type".
 */
export function renderAnsvarsomraadeType(component, ansvarsomraadeTypeKey) {
    const data = component?.resourceValues?.data[ansvarsomraadeTypeKey];
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: "h4",
        resourceBindings: {
            tiltaksklasse: component?.resourceBindings?.tiltaksklasse,
            ansvarsomraade: component?.resourceBindings?.ansvarsomraade,
            foretak: component?.resourceBindings?.foretak,
            planlagteSamsvarKontrollErklaeringer: component?.resourceBindings?.planlagteSamsvarKontrollErklaeringer,
            ansvarsomraadeStatus: component?.resourceBindings?.ansvarsomraadeStatus,
            samsvarKontrollPlanlagtVedRammetillatelse: component?.resourceBindings?.samsvarKontrollPlanlagtVedRammetillatelse,
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: component?.resourceBindings?.samsvarKontrollPlanlagtVedIgangsettingstillatelse,
            samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: component?.resourceBindings?.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse,
            samsvarKontrollPlanlagtVedFerdigattest: component?.resourceBindings?.samsvarKontrollPlanlagtVedFerdigattest
        },
        resourceValues: {
            data,
            title: getAnsvarsomraadeTitle(data[0])
        }
    });
    return createCustomElement("custom-table-ansvarsomraade", htmlAttributes);
}

/**
 * Renders a custom paragraph element displaying the empty field text for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {string} [component.resourceValues.data] - The text to display as the empty field.
 * @returns {HTMLElement} The custom paragraph element with the specified attributes.
 */
export function renderEmptyFieldText(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return createCustomElement("custom-paragraph", htmlAttributes);
}
