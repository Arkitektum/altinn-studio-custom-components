import type { InstantiatedComponent } from "../../../types.ts";
import type Overvann from "../../../classes/data-classes/Overvann.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../shared/childElements.ts";

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
 * Renders a custom boolean text field element for "ledesOvervannTilTerreng".
 *
 * This function creates a custom field element that displays a boolean value
 * with localized text, based on the provided component's resource bindings and values.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} component?.resourceBindings - Resource bindings for localization.
 * @param {Object} component?.resourceBindings.ledesOvervannTilTerreng - Bindings for the specific field.
 * @param {string} component?.resourceBindings.ledesOvervannTilTerreng.title - The title for the field.
 * @param {string} component?.resourceBindings.ledesOvervannTilTerreng.trueText - Text to display when value is true.
 * @param {string} component?.resourceBindings.ledesOvervannTilTerreng.falseText - Text to display when value is false.
 * @param {Object} component?.resourceValues - Resource values containing data.
 * @param {Object} component?.resourceValues.data - Data object for the field.
 * @param {boolean} component?.resourceValues.data.ledesOvervannTilTerreng - Boolean value to display.
 * @returns {HTMLElement} The rendered custom field element wrapped in a container.
 */
export function renderLedesOvervannTilTerrengElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Overvann | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ledesOvervannTilTerreng?.title,
            trueText: component?.resourceBindings?.ledesOvervannTilTerreng?.trueText,
            falseText: component?.resourceBindings?.ledesOvervannTilTerreng?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.ledesOvervannTilTerreng
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "ledesOvervannTilAvloepssystem".
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderLedesOvervannTilAvloepssystemElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Overvann | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ledesOvervannTilAvloepssystem?.title,
            trueText: component?.resourceBindings?.ledesOvervannTilAvloepssystem?.trueText,
            falseText: component?.resourceBindings?.ledesOvervannTilAvloepssystem?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.ledesOvervannTilAvloepssystem
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
