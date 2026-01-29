// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../../functions/helpers.js";

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

export function renderAvdekketGjenstaaendePROElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.avdekketArbeider?.title,
            emptyFieldText: component?.resourceBindings?.avdekketArbeider?.emptyFieldText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.prosjekterendeList?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

export function renderAvdekketGjenstaaendeUTFElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.avdekketArbeider?.title,
            emptyFieldText: component?.resourceBindings?.avdekketArbeider?.emptyFieldText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.utfoerende?.utfoerendeList?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-list-data", htmlAttributes));
}

export function renderGjenstaaendeArbeiderInnenforElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.arbeidGjenstaaendeInnenfor?.title,
            emptyFieldText: component?.resourceBindings?.arbeidGjenstaaendeInnenfor?.emptyFieldText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.gjenstaaendeArbeider?.gjenstaaendeInnenfor
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderGjenstaaendeArbeiderUtenforElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.arbeidGjenstaaendeUtenfor?.title,
            emptyFieldText: component?.resourceBindings?.arbeidGjenstaaendeUtenfor?.emptyFieldText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.gjenstaaendeArbeider?.gjenstaaendeUtenfor
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderTilstrekkeligSikkerhetElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.tilstrekkeligSikkerhet?.title,
            trueText: component?.resourceBindings?.tilstrekkeligSikkerhet?.trueText,
            falseText: component?.resourceBindings?.tilstrekkeligSikkerhet?.falseText,
            defaultText: component?.resourceBindings?.tilstrekkeligSikkerhet?.defaultText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.sikkerhet?.harTilstrekkeligSikkerhet
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

export function renderUtfoereInnenElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        format: "date",
        resourceBindings: {
            title: component?.resourceBindings?.utfoereInnen?.title,
            emptyFieldText: component?.resourceBindings?.utfoereInnen?.emptyFieldText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.sikkerhet?.utfoertInnen
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderTypeArbeiderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.typeArbeider?.title,
            emptyFieldText: component?.resourceBindings?.typeArbeider?.emptyFieldText
        },
        resourceValues: {
            data: component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.sikkerhet?.typeArbeider
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
