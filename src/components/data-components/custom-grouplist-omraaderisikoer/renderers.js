// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom group list component for "sjekklistekrav" (checklist requirements).
 *
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.hideIfEmpty] - Whether to hide the component if it is empty.
 * @param {boolean} [component.enableLinks] - Whether to enable links within the component.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @returns {HTMLElement} The rendered custom group list element.
 */
export function renderSjekklistekravGroupList(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: component?.hideIfEmpty,
        enableLinks: component?.enableLinks,
        resourceBindings: component?.resourceBindings,
        resourceValues: component?.resourceValues
    });
    return createCustomElement("custom-grouplist-sjekklistekrav", htmlAttributes);
}
