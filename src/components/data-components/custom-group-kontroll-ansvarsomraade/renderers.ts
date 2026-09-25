import type { InstantiatedComponent } from "../../../types.ts";
import type KontrollAnsvarsomraade from "../../../classes/data-classes/KontrollAnsvarsomraade.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

export function renderHeaderElement(title: string, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

export function renderFunksjonElement(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: { title: component?.resourceBindings?.funksjon?.title },
        resourceValues: {
            data: (component?.resourceValues?.data as KontrollAnsvarsomraade | undefined)?.funksjon?.kodeverdi
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderBeskrivelseElement(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: { title: component?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.title },
        resourceValues: {
            data: (component?.resourceValues?.data as KontrollAnsvarsomraade | undefined)?.beskrivelseAvAnsvarsomraadet
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderAnsvarsrettErklaertElement(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        format: "date",
        resourceBindings: { title: component?.resourceBindings?.datoAnsvarsrettErklaert?.title },
        resourceValues: {
            data: (component?.resourceValues?.data as KontrollAnsvarsomraade | undefined)?.datoAnsvarsrettErklaert
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderArbeidetAvsluttetElement(component?: InstantiatedComponent | null) {
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
            data: (component?.resourceValues?.data as KontrollAnsvarsomraade | undefined)?.erAnsvarsomraadetAvsluttet
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

export function renderFunnetAvvikElement(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: { title: component?.resourceBindings?.erDetFunnetAvvik?.title },
        resourceValues: {
            data: (component?.resourceValues?.data as KontrollAnsvarsomraade | undefined)?.kontrollerendeList?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderEmptyFieldText(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}
