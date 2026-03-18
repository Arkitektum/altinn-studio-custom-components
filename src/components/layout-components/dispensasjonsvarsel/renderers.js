// Dependencies
import { addContainerElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 *
 * Renders the header element for the Dispensasjonsvarsel component.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @param {string} [size="h1"] - The size of the header element, defaulting to "h1".
 * @returns {HTMLElement} A custom header text element with the appropriate resource binding for the title.
 */
export function renderDispensasjonsvarselHeader(component, size = "h1") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.dispensasjonsvarsel?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the "emne" (subject) element for the Dispensasjonsvarsel component, which displays the theme of the dispensation case.
 *
 * The content of the "emne" element is determined based on whether the component's data indicates that it is of the "Andre Planbestemmelser" type. If it is, the "annetTema" value from the component's resource values is used; otherwise, the "dispensasjonstema.kodebeskrivelse" value is used.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @returns {HTMLElement} A custom field data element with the appropriate resource binding for the title and the determined data value.
 */
export function renderEmne(component) {
    const data = component?.isAndrePlanbestemmelser
        ? component?.resourceValues?.data?.annetTema
        : component?.resourceValues?.data?.dispensasjonstema?.kodebeskrivelse;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component.resourceBindings?.emne?.title
        },
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the header element for the "bestemmelse" section of the Dispensasjonsvarsel component.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @param {string} [size="h2"] - The size of the header element, defaulting to "h2".
 * @returns {HTMLElement} A custom header text element with the appropriate resource binding for the title.
 */
export function renderBestemmelseHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.bestemmelse?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the element that displays the plan name and paragraph number for the dispensation case, based on the component's data type.
 *
 * If the component's data indicates that it is of the "Plan Bestemmelses Type", the rendered element will display both the plan name and paragraph number in the format "plannavn, paragrafnummer". If it is not of this type, only the paragraph number will be displayed.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @returns {HTMLElement} A custom field data element with the appropriate resource binding for the title and the determined data value.
 */
export function renderPlannavnParagrafnummer(component) {
    const data = component?.isPlanBestemmelsesType
        ? `${component?.resourceValues?.data?.plannavn}, ${component?.resourceValues?.data?.paragrafnummer}`
        : component?.resourceValues?.data?.paragrafnummer;
    const title = component?.isPlanBestemmelsesType ? component.resourceBindings?.plannavn?.title : component.resourceBindings?.paragrafnummer?.title;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title
        },
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the element that displays the "bestemmelsestekst" (text of the provision) for the dispensation case.
 *
 * The content of the element is determined based on the component's data type. If the component's data indicates that it is of the "Plan Bestemmelses Type", the "bestemmelsestekst" value from the component's resource values is used; otherwise, it will not be displayed.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @returns {HTMLElement} A custom field data element with the appropriate resource binding for the title and the determined data value.
 */
export function renderBestemmelsestekst(component) {
    const title = component?.resourceValues?.data?.bestemmelsesoverskrift;
    const data = component?.resourceValues?.data?.bestemmelsestekst;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            title,
            data
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the header element for the "dispensasjonsvarsel" description section.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @param {string} size - The size of the header element (e.g., "h1", "h2", "h3").
 * @returns {HTMLElement} A custom header text element with the appropriate resource binding for the title.
 */
export function renderDispVarselBeskrivelseHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size: size,
        resourceBindings: {
            title: component.resourceBindings?.dispVarselBeskrivelse?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the element that displays the "dispensasjonsvarsel" description for the dispensation case.
 *
 * The content of the element is determined based on the component's data type. If the component's data indicates that it is of the "Plan Bestemmelses Type", the "dispensasjonsvarsel" description value from the component's resource values is used; otherwise, it will not be displayed.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @returns {HTMLElement} A custom field data element with the appropriate resource binding for the title and the determined data value.
 */
export function renderDispVarselBeskrivelse(component) {
    const data = component?.resourceValues?.data?.dispVarselBeskrivelse;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: true,
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the element that displays the question about the dispensation application for the dispensation case.
 *
 * The content of the element is determined based on the component's data type. If the component's data indicates that it is of the "Plan Bestemmelses Type", the question about the dispensation application value from the component's resource values is used; otherwise, it will not be displayed.
 *
 * @param {Object} component - The instance of the CustomDispensasjonsvarsel component containing resource bindings and values.
 * @returns {HTMLElement} A custom paragraph text element with the appropriate resource binding for the title and the determined data value.
 */
export function renderSpoersmaalOmDispensasjonssoeknaden(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceBindings: {
            title: component.resourceBindings?.spoersmaalOmDispensasjonssoeknaden?.title
        },
        styleOverride: {
            fontWeight: "600"
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}
