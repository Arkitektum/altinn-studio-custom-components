//Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../../functions/helpers.js";

function renderHeaderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            dataTitle: component?.resourceValues?.data?.dispensasjonFra?.bestemmelserType?.kodebeskrivelse
        },
        resourceBindings: {
            title: component?.resourceBindings?.bestemmelsestype?.title
        },
        styleOverride: {
            textDecoration: "underline"
        }
    });
    return createCustomElement("custom-header-text-data", htmlAttributes);
}

function renderBestemmelseFieldDataElement(component) {
    const lovbestemmelse = component?.resourceValues?.data?.dispensasjonFra?.lovbestemmelse;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.bestemmelse?.title //??
        },
        resourceValues: {
            data: lovbestemmelse
                ? lovbestemmelse
                : component?.resourceValues?.data?.dispensasjonFra?.dispensasjonPlanBestemmelse?.planbestemmelse?.nummerering
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}
function renderBegrunnelseFieldDataElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.begrunnelse?.title
        },
        resourceValues: {
            data: component?.resourceValues?.data?.begrunnelse?.hensynBakBestemmelsen
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderDispensasjonerUnitInListElement(component) {
    const dispensasjonerUnitInListElement = document.createElement("div");

    dispensasjonerUnitInListElement.appendChild(renderHeaderElement(component));

    dispensasjonerUnitInListElement.appendChild(renderBestemmelseFieldDataElement(component));
    dispensasjonerUnitInListElement.appendChild(renderBegrunnelseFieldDataElement(component));
    return dispensasjonerUnitInListElement;
}
