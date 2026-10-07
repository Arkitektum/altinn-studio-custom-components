import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/*
 * The pieces nearly every group component draws inside itself: a heading, and the paragraph shown in place of its
 * content when it is empty. They were copied into each component's renderers.ts, and webpack kept every copy, so each
 * component now re-exports these instead, keeping its own name for them and its own default heading level.
 */

/**
 * Renders the heading a group component puts over its content, as a child `custom-header-text`.
 *
 * @param {string} title - The heading's text.
 * @param {string} size - The heading level ("h1" to "h6").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderChildHeaderElement(title: string, size: string) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the same heading for a title given as a text resource key rather than as text, which the child component
 * looks up itself.
 *
 * @param {string} titleResourceKey - The text resource key of the heading's text.
 * @param {string} size - The heading level ("h1" to "h6").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderChildHeaderElementFromResource(titleResourceKey: string, size: string) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title: titleResourceKey
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the paragraph a group component shows in place of its content when it is empty. By then the component class
 * has put the empty-field text where the data would be, which is why it is read from `resourceValues.data`.
 *
 * @param {Object} component - The component whose empty-field text to show.
 * @returns {HTMLElement} The custom paragraph element, wrapped in a container.
 */
export function renderEmptyFieldText(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}
