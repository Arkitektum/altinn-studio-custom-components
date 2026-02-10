// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement, getTextResourceFromResourceBinding } from "../../../../functions/helpers.js";

/**
 * Renders a custom element for displaying "Nabo Gjenboer Eiendom" data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing property information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.eiendom] - The resource binding for "eiendom".
 * @param {string} [component.resourceBindings.eiendom.title] - The title for the "eiendom" resource.
 * @returns {HTMLElement} The rendered custom table element wrapped in a container.
 */
export function renderNaboGjenboerEiendomElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: component?.size || "h4",
        resourceBindings: {
            title: component?.resourceBindings?.eiendom?.title
        },
        resourceValues: {
            data: data?.eiendommer?.eiendom
        }
    });
    return addContainerElement(createCustomElement("custom-table-nabo-gjenboer-eiendom", htmlAttributes));
}

/**
 * Renders a custom table part element for "eier" (owner) part type.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values associated with the component.
 * @param {Object} component.resourceValues.data - The data object containing "eier" information.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.eier - The resource bindings specific to "eier".
 * @param {string} component.resourceBindings.eier.title - The title for the "eier" part.
 * @returns {HTMLElement} The rendered custom table part element wrapped in a container.
 */
export function renderEierPartElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: component?.size || "h4",
        partType: "eier",
        resourceBindings: {
            title: component?.resourceBindings?.eier?.title
        },
        resourceValues: {
            data: data?.eier
        }
    });
    return addContainerElement(createCustomElement("custom-table-part", htmlAttributes));
}

/**
 * Renders a custom address element for the "eier" (owner) within a group component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "eier" information.
 * @param {Object} [component.resourceValues.data.eier] - The "eier" (owner) object.
 * @param {string} [component.resourceValues.data.eier.adresse] - The address of the "eier".
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.eierAdresse] - The resource binding for the address.
 * @param {string} [component.resourceBindings.eierAdresse.title] - The title for the address field.
 * @returns {HTMLElement} The rendered custom address element wrapped in a container.
 */
export function renderEierAdresseElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.eierAdresse?.title
        },
        resourceValues: {
            data: data?.eier?.adresse
        }
    });
    return addContainerElement(createCustomElement("custom-field-adresse", htmlAttributes));
}

/**
 * Renders a custom element displaying the "Respons Nabovarsel Sendt Via" field.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing response information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.responsNabovarselSendtVia] - The resource binding for the title.
 * @param {string} [component.resourceBindings.responsNabovarselSendtVia.title] - The title for the field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderResponsNabovarselSendtViaElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.responsNabovarselSendtVia?.title
        },
        resourceValues: {
            data: data?.respons?.nabovarselSendtVia?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom field data element for "responsNabovarselSendt".
 *
 * This function creates a custom element with specific HTML attributes,
 * including formatting as a date and resource bindings for the title and data.
 * The element is wrapped in a container element before being returned.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing "respons".
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.responsNabovarselSendt - The resource binding for the title.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderResponsNabovarselSendtElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        format: "date",
        resourceBindings: {
            title: component?.resourceBindings?.responsNabovarselSendt?.title
        },
        resourceValues: {
            data: data?.respons?.nabovarselSendt
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom element displaying the response status for "Merknad" (remark) or "Samtykke" (consent) received.
 *
 * Determines which text resource to display based on the values of `erMerknadMottatt` and `erSamtykkeMottatt`
 * from the component's resource values. It then creates a custom element with the appropriate attributes and data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values, including response data.
 * @param {Object} component.resourceValues.data - The data object containing response flags.
 * @param {Object} component.resourceBindings - The resource bindings for text resources.
 * @returns {HTMLElement} The custom element representing the response status.
 */
export function renderResponsErMerknadEllerSamtykkeMottattElement(component) {
    const data = component?.resourceValues?.data;
    const erMerknadMottatt = data?.respons?.erMerknadMottatt;
    const erSamtykkeMottatt = data?.respons?.erSamtykkeMottatt;
    let value = "";
    if (erMerknadMottatt !== true  && erSamtykkeMottatt !== true) {
        value = getTextResourceFromResourceBinding(component?.resourceBindings?.responsErMerknadEllerSamtykkeMottatt?.falseText);
    } else if (erMerknadMottatt === true && erSamtykkeMottatt !== true) {
        value = getTextResourceFromResourceBinding(component?.resourceBindings?.responsErMerknadMottatt?.trueText);
    } else if (erMerknadMottatt !== true && erSamtykkeMottatt === true) {
        value = getTextResourceFromResourceBinding(component?.resourceBindings?.responsErSamtykkeMottatt?.trueText);
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceBindings: {
            title: component?.resourceBindings?.responsErMerknadEllerSamtykkeMottatt?.title
        },
        resourceValues: {
            data: value
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom element displaying either the date a remark ("merknad") or consent ("samtykke") was received,
 * based on the provided component's data. The function determines which date and title to use depending on the
 * response flags in the component's resource values.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - Contains the data for the component.
 * @param {Object} component.resourceValues.data - The data object with response information.
 * @param {Object} component.resourceValues.data.respons - The response object.
 * @param {boolean} component.resourceValues.data.respons.erMerknadMottatt - Indicates if a remark was received (true/false/null).
 * @param {boolean} component.resourceValues.data.respons.erSamtykkeMottatt - Indicates if consent was received (true/false/null).
 * @param {string} [component.resourceValues.data.respons.merknadMottattDato] - The date a remark was received.
 * @param {string} [component.resourceValues.data.respons.samtykkeMottattDato] - The date consent was received.
 * @param {Object} component.resourceBindings - Contains title bindings for the fields.
 * @param {string} [component.resourceBindings.responsMerknadMottattDato.title] - The title for the remark received date.
 * @param {string} [component.resourceBindings.responsSamtykkeMottattDato.title] - The title for the consent received date.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderResponsSamtykkeEllerMerknadMottattElement(component) {
    const data = component?.resourceValues?.data;
    const erMerknadMottatt = data?.respons?.erMerknadMottatt;
    const erSamtykkeMottatt = data?.respons?.erSamtykkeMottatt;
    let value;
    let title;
    if (erMerknadMottatt === true && erSamtykkeMottatt !== true) {
        value = data?.respons?.merknadMottattDato;
        title = component?.resourceBindings?.responsMerknadMottattDato?.title;
    } else if (erMerknadMottatt !== true && erSamtykkeMottatt === true) {
        value = data?.respons?.samtykkeMottattDato;
        title = component?.resourceBindings?.responsSamtykkeMottattDato?.title;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        format: "date",
        resourceBindings: {
            title
        },
        resourceValues: {
            data: value
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
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
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}
