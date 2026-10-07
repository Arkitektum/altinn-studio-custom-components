import type { InstantiatedComponent } from "../../../../types.ts";
import type Sjekklistekrav from "../../../../classes/data-classes/Sjekklistekrav.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../../shared/childElements.ts";

// Global functions
import { renderLayoutContainerElement } from "../../../../functions/helpers.ts";

/**
 * Renders this component's heading, at h3 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} title - The heading's text.
 * @param {string} [size="h3"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title: string, size = "h3") {
    return renderChildHeaderElement(title, size);
}

/**
 * Renders the text for a "sjekklistepunkt" (checklist item) component.
 *
 * @param {Object} component - The component object containing resource values and configuration.
 * @param {Object} [component?.resourceValues] - The resource values for the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing checklist item details.
 * @param {Object} [component?.resourceValues.data.sjekklistepunkt] - The checklist item object.
 * @param {string} [component?.resourceValues.data.sjekklistepunkt.kodebeskrivelse] - The description of the checklist item.
 * @param {any} [component?.resourceValues.data.dokumentasjon] - Documentation related to the checklist item.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the component.
 * @returns {HTMLElement} The rendered custom field element wrapped in a container.
 */
export function renderSjekklistepunkText(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Sjekklistekrav | undefined;
    const grid = { xs: 11 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        enableLinks: component?.enableLinks,
        grid,
        resourceValues: {
            title: data?.sjekklistepunkt?.kodebeskrivelse,
            data: data?.dokumentasjon
        },
        styleOverride: {
            paddingRight: "10px"
        }
    });
    return addContainerElement(createCustomElement("custom-field", htmlAttributes), grid);
}

/**
 * Renders a custom boolean text field for a checklist item value.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceValues.data - The data object containing checklist item answers.
 * @param {Object} component?.resourceBindings - The resource bindings for true, false, and default text.
 * @param {string} [component?.resourceBindings.trueText] - The text to display for a true value.
 * @param {string} [component?.resourceBindings.falseText] - The text to display for a false value.
 * @param {string} [component?.resourceBindings.defaultText] - The text to display for a default value.
 * @returns {HTMLElement} The rendered custom boolean text field wrapped in a container element.
 */
export function renderSjekklistepunkValue(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Sjekklistekrav | undefined;
    const grid = { xs: 1 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: true,
        grid,
        resourceBindings: {
            trueText: component?.resourceBindings?.trueText,
            falseText: component?.resourceBindings?.falseText,
            defaultText: component?.resourceBindings?.defaultText
        },
        resourceValues: {
            data: data?.sjekklistepunktsvar
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes), grid);
}

/**
 * Renders a checklist item component by creating a container element and appending
 * the item's text and value elements.
 *
 * @param {Object} component - The component data used to render the checklist item.
 * @returns {HTMLElement} The container element with the rendered checklist item.
 */
export function renderSjekklistepunk(component?: InstantiatedComponent | null) {
    const containerElement = renderLayoutContainerElement();

    containerElement.appendChild(renderSjekklistepunkText(component));
    containerElement.appendChild(renderSjekklistepunkValue(component));

    return containerElement;
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../../shared/childElements.ts";
