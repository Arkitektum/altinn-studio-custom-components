// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom list element for "planlagte løfteinnretninger" using the provided component.
 *
 * @param {Object} component - The component configuration or data to be rendered.
 * @returns {HTMLElement} The custom list element representing the planned lifting devices.
 */
export function renderPlanlagteLoefteinnretningerList(component) {
    const htmlAttributes = new CustomElementHtmlAttributes(component);
    const planlagteLoefteinnretningerList = createCustomElement("custom-list", htmlAttributes);
    return planlagteLoefteinnretningerList;
}
