import Dispensasjon from "../../../classes/layout-classes/Dispensasjon.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

export function getDispensasjon(component) {
    return hasValue(component?.formData) && new Dispensasjon(component.formData);
}

export function renderDispansasjonHeader(dispensasjon) {
    const title = dispensasjon?.dispensasjonBeskrivelse?.dispensasjonTittel?.kodebeskrivelse;
    if (!hasValue(title)) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: title,
        size: "h1"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

export function renderDispensasjonReferanse(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonReferanse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonReferanse?.title),
        hideIfEmpty: true,
        grid: {
            xs: 6
        }
    });
    return createCustomElement("custom-field-data", htmlAttributes);
}

export function renderMetadataFtbId(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.metadata?.ftbId },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.metadataFtbId?.title),
        hideIfEmpty: true,
        grid: {
            xs: 6
        }
    });
    return createCustomElement("custom-field-data", htmlAttributes);
}

export function renderKommunensSaksnummer(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.kommunensSaksnummer },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.kommunensSaksnummer?.title),
        hideIfEmpty: true,
        grid: {
            xs: 6
        }
    });
    return createCustomElement("custom-field-kommunens-saksnummer", htmlAttributes);
}

export function renderSoeknadenGjelderHeader(textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.soeknadenGjelderHeader?.title),
        size: "h2"
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

export function renderEiendomTable(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.eiendomByggested?.eiendom },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.eiendomByggested?.title),
        hideIfEmpty: true
    });
    return createCustomElement("custom-table-eiendom", htmlAttributes);
}

export function renderTiltakshaverTable(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.tiltakshaver },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.tiltakshaver?.title),
        hideIfEmpty: true
    });
    return createCustomElement("custom-table-tiltakshaver", htmlAttributes);
}
