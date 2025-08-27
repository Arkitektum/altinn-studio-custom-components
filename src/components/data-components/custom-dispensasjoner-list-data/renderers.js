//Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

function renderUnitElement(item) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            data: item
        }
    });
    return createCustomElement("custom-dispensasjoner-unit-in-list", htmlAttributes);
}
export function renderDispensasjonerListElement(component) {
    const dispensasjonerListDataElement = document.createElement("div");
    component?.resourceValues?.data?.forEach((item) => {
        dispensasjonerListDataElement.appendChild(renderUnitElement(item));
    });
    return dispensasjonerListDataElement;
}
