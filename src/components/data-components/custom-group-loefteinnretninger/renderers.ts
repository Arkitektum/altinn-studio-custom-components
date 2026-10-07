import type { InstantiatedComponent } from "../../../types.ts";
import type Loefteinnretninger from "../../../classes/data-classes/Loefteinnretninger.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../shared/childElements.ts";

/**
 * Renders this component's heading, at h2 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} title - The heading's text.
 * @param {string} [size="h2"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title: string, size = "h2") {
    return renderChildHeaderElement(title, size);
}

/**
 * Renders a custom boolean text field for "Er løfteinnretning i bygning" within a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceValues.data - The data object containing boolean value.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @param {Object} component?.resourceBindings.erLoefteinnretningIBygning - Bindings for the boolean field.
 * @param {string} component?.resourceBindings.erLoefteinnretningIBygning.title - The title for the field.
 * @param {string} component?.resourceBindings.erLoefteinnretningIBygning.trueText - Text to display when value is true.
 * @param {string} component?.resourceBindings.erLoefteinnretningIBygning.falseText - Text to display when value is false.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderErLoefteinnretningIBygningElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Loefteinnretninger | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.erLoefteinnretningIBygning?.title,
            trueText: component?.resourceBindings?.erLoefteinnretningIBygning?.trueText,
            falseText: component?.resourceBindings?.erLoefteinnretningIBygning?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.erLoefteinnretningIBygning
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field for the "planleggesLoefteinnretningIBygning" property of a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderPlanleggesLoefteinnretningIBygningElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Loefteinnretninger | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.planleggesLoefteinnretningIBygning?.title,
            trueText: component?.resourceBindings?.planleggesLoefteinnretningIBygning?.trueText,
            falseText: component?.resourceBindings?.planleggesLoefteinnretningIBygning?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.planleggesLoefteinnretningIBygning
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom element for displaying planned lifting devices.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component?.resourceValues] - The resource values for the component.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderPlanlagteLoefteinnretningerElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Loefteinnretninger | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.planlagteLoefteinnretninger?.title,
            emptyFieldText: component?.resourceBindings?.planlagteLoefteinnretninger?.emptyFieldText
        },
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-list-planlagte-loefteinnretninger", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
