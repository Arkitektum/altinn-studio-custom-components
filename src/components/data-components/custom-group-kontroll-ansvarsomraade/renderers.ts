import type { InstantiatedComponent } from "../../../types.ts";
import type KontrollAnsvarsomraade from "../../../classes/data-classes/KontrollAnsvarsomraade.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElementFromResource } from "../shared/childElements.ts";

/**
 * Renders this component's heading, at h2 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} titleResourceKey - The text resource key of the heading's text.
 * @param {string} [size="h2"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(titleResourceKey: string, size = "h2") {
    return renderChildHeaderElementFromResource(titleResourceKey, size);
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

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
