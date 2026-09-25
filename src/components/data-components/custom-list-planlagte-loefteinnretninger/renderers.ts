import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";
import type { CustomElementProps } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom list element for "planlagte løfteinnretninger" using the provided component.
 *
 * @param {Object} component - The component configuration or data to be rendered.
 * @returns {HTMLElement} The custom list element representing the planned lifting devices.
 */
export function renderPlanlagteLoefteinnretningerList(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes(component as CustomElementProps);
    const planlagteLoefteinnretningerList = createCustomElement("custom-list", htmlAttributes);
    return planlagteLoefteinnretningerList;
}
