import type { InstantiatedComponent } from "../../../../types.ts";
import type NaboGjenboerEiendom from "../../../../classes/data-classes/NaboGjenboerEiendom.ts";
// Dependencies
import {
    CustomElementHtmlAttributes,
    addContainerElement,
    createCustomElement,
    getTextResourceFromResourceBinding,
    hasValue
} from "@arkitektum/altinn-studio-custom-components-utils";
import { formatDate } from "../../../../functions/dataFormatHelpers.ts";

/**
 * Renders a custom element for displaying "Nabo Gjenboer Eiendom" data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - The resource values associated with the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing property information.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component?.resourceBindings.eiendomMatrikkelinformasjon] - The bindings for the table's title.
 * @param {Object} [component?.resourceBindings.eiendomMatrikkelinformasjonAdresse] - The bindings for the address column, and likewise for the other eiendomMatrikkelinformasjon* columns.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderNaboGjenboerEiendomElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as NaboGjenboerEiendom | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: component?.size || "h4",
        // Renamed from this group's eiendomMatrikkelinformasjon* bindings into the names custom-table-nabo-gjenboer-eiendom reads.
        resourceBindings: {
            title: component?.resourceBindings?.eiendomMatrikkelinformasjon?.title,
            adresse: component?.resourceBindings?.eiendomMatrikkelinformasjonAdresse,
            eiendomsidentifikasjonGaardsnummer: component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer,
            eiendomsidentifikasjonBruksnummer: component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer,
            eiendomsidentifikasjonSeksjonsnummer: component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer,
            eiendomsidentifikasjonFestenummer: component?.resourceBindings?.eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer,
            bolignummer: component?.resourceBindings?.eiendomMatrikkelinformasjonBolignummer,
            bygningsnummer: component?.resourceBindings?.eiendomMatrikkelinformasjonBygningsnummer
        },
        resourceValues: {
            data: data?.eiendommer?.eiendom
        }
    });
    return createCustomElement("custom-table-nabo-gjenboer-eiendom", htmlAttributes);
}

/**
 * Renders the name of the "eier" (owner) as a single field, in place of a full part table.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues.data] - The data object containing "eier" information.
 * @param {Object} [component?.resourceBindings.eier] - The resource binding for the field.
 * @param {string} [component?.resourceBindings.eier.title] - The title for the field.
 * @returns {HTMLElement} The rendered custom field element wrapped in a container.
 */
export function renderEierNavnElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as NaboGjenboerEiendom | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.eier?.title
        },
        resourceValues: {
            data: data?.eier
        }
    });
    return addContainerElement(createCustomElement("custom-field-part-navn", htmlAttributes));
}

/**
 * Renders the "Nabovarsel sendt" field, combining how and when the notification was sent into one value,
 * as "<via>, <date>", or whichever of the two is present.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues.data] - The data object containing response information.
 * @param {Object} [component?.resourceBindings.responsNabovarselSendt] - The resource binding for the field.
 * @param {string} [component?.resourceBindings.responsNabovarselSendt.title] - The title for the field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderResponsNabovarselSendtElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as NaboGjenboerEiendom | undefined;
    const dateValue = hasValue(data?.respons?.nabovarselSendt) ? formatDate(data?.respons?.nabovarselSendt) : undefined;
    const viaValue = hasValue(data?.respons?.nabovarselSendtVia?.kodebeskrivelse) ? data?.respons?.nabovarselSendtVia?.kodebeskrivelse : undefined;
    const combinedValue = viaValue && dateValue ? `${viaValue}, ${dateValue}` : viaValue || dateValue;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.responsNabovarselSendt?.title
        },
        resourceValues: {
            data: combinedValue
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders the response status, shown only when exactly one of `erMerknadMottatt` and `erSamtykkeMottatt` is true.
 * The value is the matching "merknad" or "samtykke" text followed by its date, or the text alone when there is no date.
 * When neither or both are true the field is left empty and hidden.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues.data] - The data object containing the response flags and dates.
 * @param {Object} [component?.resourceBindings.responsErMerknadEllerSamtykkeMottatt] - The resource binding for the field's title.
 * @param {Object} [component?.resourceBindings.responsMerknadMottattDato] - Its title is the status text when a "merknad" was received.
 * @param {Object} [component?.resourceBindings.responsSamtykkeMottattDato] - Its title is the status text when a "samtykke" was received.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderResponsErMerknadEllerSamtykkeMottattElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as NaboGjenboerEiendom | undefined;
    const erMerknadMottatt = data?.respons?.erMerknadMottatt === true;
    const erSamtykkeMottatt = data?.respons?.erSamtykkeMottatt === true;
    let statusValue: string | undefined;
    let dateValue: string | undefined;
    if (erMerknadMottatt && !erSamtykkeMottatt) {
        statusValue = getTextResourceFromResourceBinding(component?.resourceBindings?.responsMerknadMottattDato?.title);
        dateValue = formatDate(data?.respons?.merknadMottattDato);
    } else if (erSamtykkeMottatt && !erMerknadMottatt) {
        statusValue = getTextResourceFromResourceBinding(component?.resourceBindings?.responsSamtykkeMottattDato?.title);
        dateValue = formatDate(data?.respons?.samtykkeMottattDato);
    }
    const value = hasValue(statusValue) && hasValue(dateValue) ? `${statusValue} ${dateValue}` : statusValue;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.responsErMerknadEllerSamtykkeMottatt?.title
        },
        resourceValues: {
            data: value
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../../shared/childElements.ts";
