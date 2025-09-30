// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

export function renderSjekklistekravGroupList(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            trueText: component?.resourceBindings?.trueText,
            falseText: component?.resourceBindings?.falseText,
            defaultText: component?.resourceBindings?.defaultText
        },
        resourceValues: component?.resourceValues
    });
    return createCustomElement("custom-grouplist-sjekklistekrav", htmlAttributes);
}
