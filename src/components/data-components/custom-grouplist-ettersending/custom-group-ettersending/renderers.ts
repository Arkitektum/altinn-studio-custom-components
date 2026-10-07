import type Ettersending from "../../../../classes/data-classes/Ettersending.ts";
import type { InstantiatedComponent } from "../../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../../shared/childElements.ts";

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
 * Renders a custom field data element for a "tema" (topic) using provided component data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - Resource values associated with the component.
 * @param {Object} [component?.resourceValues.data] - Data object containing "tema" information.
 * @param {Object} [component?.resourceBindings] - Resource bindings for the component.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the element.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderTemaElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Ettersending | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.tema?.title
        },
        resourceValues: {
            data: data?.tema?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom comment element for a group list component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - The resource values for the component.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the element.
 * @returns {HTMLElement} The rendered custom comment element wrapped in a container.
 */
export function renderKommentarElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Ettersending | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.kommentar?.title
        },
        resourceValues: {
            data: data?.kommentar,
            emptyFieldText: "-"
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom list element for attachments ("vedleggsliste").
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceValues.data - The data object containing attachment list information.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom list element wrapped in a container.
 */
export function renderVedleggslisteElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Ettersending | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.vedleggsliste?.title
        },
        resourceValues: {
            data: data?.vedleggsliste?.vedlegg
        }
    });
    return addContainerElement(createCustomElement("custom-list-vedlegg", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../../shared/childElements.ts";
