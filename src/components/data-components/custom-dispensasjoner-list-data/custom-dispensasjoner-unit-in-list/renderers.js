//Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../functions/helpers.js";

function renderHeaderElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            data: component?.resourceValues?.data?.dispensasjonFra?.bestemmelserType?.kodebeskrivelse
        },
        resourceBindings: {
            title: component?.resourceBindings?.dispensasjonEllerTillatelse?.title
        }
    });
    return createCustomElement("custom-header-text-data", htmlAttributes);
}
function renderSubHeaderElement(component) {
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
    console.log("htmlAttributes i unit in list", htmlAttributes);
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
    console.log("htmlAttributes i unit in list", htmlAttributes);
    return createCustomElement("custom-paragraph-text-data", htmlAttributes);
}

export function renderDispensasjonerUnitInListElement(component) {
    const dispensasjonerUnitInListElement = document.createElement("div");

    dispensasjonerUnitInListElement.appendChild(renderHeaderElement(component));
    dispensasjonerUnitInListElement.appendChild(renderSubHeaderElement(component));

    const paragraphDiv = document.createElement("div");
    const p1 = renderParagraph1Element(component);
    const p2 = renderParagraph2Element(component);
    p1.style.display = "inline-block";
    p2.style.display = "inline-block";
    paragraphDiv.appendChild(p1);
    paragraphDiv.appendChild(document.createTextNode(" "));
    paragraphDiv.appendChild(p2);

    dispensasjonerUnitInListElement.appendChild(paragraphDiv);
    return dispensasjonerUnitInListElement;
}
