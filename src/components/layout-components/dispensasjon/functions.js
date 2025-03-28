import Dispensasjon from "../../../classes/layout-classes/Dispensasjon.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { addContainerElement, createCustomElement, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

export function getDispensasjon(component) {
    return hasValue(component?.formData) && new Dispensasjon(component.formData);
}

export function renderDispansasjonHeader(dispensasjon, size = "h1") {
    const title = dispensasjon?.dispensasjonBeskrivelse?.dispensasjonTittel?.kodebeskrivelse;
    if (!hasValue(title)) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        text: title,
        size: size
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

export function renderDispensasjonReferanse(dispensasjon, textResources, textResourceBindings) {
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonReferanse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonReferanse?.title),
        hideIfEmpty: true,
        grid
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

export function renderMetadataFtbId(dispensasjon, textResources, textResourceBindings) {
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.metadata?.ftbId },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.metadataFtbId?.title),
        hideIfEmpty: true,
        grid
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes), grid);
}

export function renderKommunensSaksnummer(dispensasjon, textResources, textResourceBindings) {
    const grid = { xs: 6 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.kommunensSaksnummer },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.kommunensSaksnummer?.title),
        hideIfEmpty: true,
        grid
    });
    return addContainerElement(createCustomElement("custom-field-kommunens-saksnummer", htmlAttributes), grid);
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

export function renderTiltakshaverAdresse(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: dispensasjon?.tiltakshaver?.adresse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.tiltakshaverAdresse?.title),
        hideIfEmpty: true
    });

    return addContainerElement(createCustomElement("custom-field-adresse", htmlAttributes));
}

export function renderInngangsbeskrivelse(dispensasjon) {
    if (
        !hasValue(dispensasjon?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse) &&
        !hasValue(dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse)
    ) {
        return null;
    }
    const condition = dispensasjon?.soeknadstype?.kodebeskrivelse === "Annet";
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: {
            simpleBinding: condition,
            trueData: dispensasjon?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse,
            falseData: dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse,
            defaultData: dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse
        },
        hideIfEmpty: true
    });
    return addContainerElement(createCustomElement("custom-field-boolean-data", htmlAttributes));
}

export function renderDispensasjonBeskrivelse(dispensasjon, textResources, textResourceBindings) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { simpleBinding: dispensasjon?.dispensasjonBeskrivelse?.beskrivelse },
        text: getTextResourceFromResourceBinding(textResources, textResourceBindings?.dispensasjonBeskrivelseBeskrivelse?.title),
        hideIfEmpty: true
    });
    return createCustomElement("custom-field-data", htmlAttributes);
}
