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
            title: component?.resourceBindings?.dispensasjonEllerTillatelse?.title
        }
    });
    return createCustomElement("custom-header-text-data", htmlAttributes);
}
function renderDispEllerTillatelseSubHeaderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.dispensasjonPlanBestemmelseNavn?.title
        }
    });
    return createCustomElement("custom-subheader-text", htmlAttributes);
}
function renderParagraph1Element(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            data: component?.resourceValues?.data?.dispensasjonFra?.dispensasjonPlanBestemmelse?.navn
        }
    });
    return createCustomElement("custom-paragraph-text-data", htmlAttributes);
}
function renderParagraph2Element(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            data: component?.resourceValues?.data?.dispensasjonFra?.dispensasjonPlanBestemmelse?.nasjonalArealplanId?.planidentifikasjon
        },
        resourceBindings: {
            body: component?.resourceBindings?.dispensasjonPlanBestemmelseNasjonalArealPlanId?.title
        },
        endSymbol: ")"
    });
    return createCustomElement("custom-paragraph-text-data", htmlAttributes);
}
function renderBestemmelseFieldDataElement(component) {
    const lovbestemmelse = component?.resourceValues?.data?.dispensasjonFra?.lovbestemmelse;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: lovbestemmelse
                ? component?.resourceBindings?.lovbestemmelse?.title
                : component?.resourceBindings?.dispensasjonPlanBestemmelsePlanBestemmelse?.title
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
    dispensasjonerUnitInListElement.appendChild(renderDispEllerTillatelseSubHeaderElement(component));

    const paragraphDiv = document.createElement("div");
    const p1 = renderParagraph1Element(component);
    const p2 = renderParagraph2Element(component);
    p1.style.display = "inline-block";
    p2.style.display = "inline-block";
    paragraphDiv.appendChild(p1);
    paragraphDiv.appendChild(document.createTextNode(" "));
    paragraphDiv.appendChild(p2);
    dispensasjonerUnitInListElement.appendChild(paragraphDiv);

    dispensasjonerUnitInListElement.appendChild(renderBestemmelseFieldDataElement(component));
    dispensasjonerUnitInListElement.appendChild(renderBegrunnelseFieldDataElement(component));
    return dispensasjonerUnitInListElement;
}
