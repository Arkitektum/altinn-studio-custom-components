// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

export function renderHeaderElement(title, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

export function renderFunksjonElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: { title: component?.resourceBindings?.funksjon?.title },
        resourceValues: {
            data: component?.resourceValues?.data?.funksjon?.kodeverdi
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderBeskrivelseElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: { title: component?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.title },
        resourceValues: {
            data: component?.resourceValues?.data?.beskrivelseAvAnsvarsomraadet
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderAnsvarsrettErklaertElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        format: "date",
        resourceBindings: { title: component?.resourceBindings?.datoAnsvarsrettErklaert?.title },
        resourceValues: {
            data: component?.resourceValues?.data?.datoAnsvarsrettErklaert
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderArbeidetAvsluttetElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.title,
            trueText: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.trueText,
            falseText: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.falseText,
            defaultText: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.defaultText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.erAnsvarsomraadetAvsluttet
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

export function renderFunnetAvvikElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: { title: component?.resourceBindings?.erDetFunnetAvvik?.title },
        resourceValues: {
            data: component?.resourceValues?.data?.kontrollerendeList?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderEmptyFieldText(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}
