// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers";

export function renderVegtypeTillatelseElement(component, vegtypeTillatelse) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            vegtype: component?.resourceBindings?.vegtype,
            erTillatelseGitt: component?.resourceBindings?.erTillatelseGitt
        },
        resourceValues: {
            data: vegtypeTillatelse
        }
    });
    return addContainerElement(createCustomElement("custom-group-vegtype-tillatelse", htmlAttributes));
}
