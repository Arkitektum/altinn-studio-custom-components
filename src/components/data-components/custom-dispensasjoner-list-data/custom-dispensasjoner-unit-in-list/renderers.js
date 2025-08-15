//Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../functions/helpers.js";

function renderHeaderElement(component) {
    console.log("fra renderer i unit in list", component);
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
    console.log("htmlAttributes i unit in list", htmlAttributes);
    return createCustomElement("custom-header-text-data", htmlAttributes);
}

export function renderDispensasjonerUnitInListElement(component) {
    console.log("fra renderDispEle i unit in list:", component);
    const dispensasjonerUnitInListElement = document.createElement("div");

    dispensasjonerUnitInListElement.appendChild(renderHeaderElement(component));
    return dispensasjonerUnitInListElement;
}
