//Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

function renderHeaderElement(component) {
    console.log("fra renderer", component);
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            dataTitle: component?.dispensasjonFra.bestemmelserType.kodebeskrivelse
        }
    });
    console.log("htmlAttributes", htmlAttributes);
    return addContainerElement(createCustomElement("custom-header-text-data", htmlAttributes));
}
export function renderDispensasjonerListElement(component) {
    const dispensasjonerListDataElement = document.createElement("div");
    console.log("fra renderDispEle:", component);
    component?.resourceValues?.data?.forEach((item) => {
        dispensasjonerListDataElement.appendChild(renderHeaderElement(item));
    });
    return dispensasjonerListDataElement;
}
