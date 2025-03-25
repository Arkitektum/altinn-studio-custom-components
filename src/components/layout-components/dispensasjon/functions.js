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

export function renderFeedbackListElement(validationMessages) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: validationMessages }
    });
    const feedbackListElement = createCustomElement("custom-feedbacklist-validation-messages", htmlAttributes);
    return feedbackListElement;
}
