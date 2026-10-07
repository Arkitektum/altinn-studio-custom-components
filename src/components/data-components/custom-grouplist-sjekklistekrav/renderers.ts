import type { InstantiatedComponent } from "../../../types.ts";
import type Sjekklistekrav from "../../../classes/data-classes/Sjekklistekrav.ts";
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
 * Renders a custom group list header element for "sjekklistekrav" (checklist requirements).
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component?.resourceBindings] - Resource bindings for text values.
 * @param {string} [component?.resourceBindings.sjekklistepunkt] - Text to display for checklist points.
 * @param {string} [component?.resourceBindings.sjekklistepunktsvar] - Text to display for checklist point answers.
 * @returns {HTMLElement|null} The custom group list header element or null if required bindings are missing.
 */
export function renderSjekklistekravGroupListHeader(component?: InstantiatedComponent | null) {
    const sjekklistepunkt = component?.resourceBindings?.sjekklistepunkt;
    const sjekklistepunktsvar = component?.resourceBindings?.sjekklistepunktsvar;
    if (!sjekklistepunkt || !sjekklistepunktsvar) {
        return null;
    }
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceBindings: {
            sjekklistepunkt,
            sjekklistepunktsvar
        }
    });
    return createCustomElement("custom-group-sjekklistekrav-header-text", htmlAttributes);
}

/**
 * Renders a custom group element for "sjekklistekrav" (checklist requirements).
 *
 * @param {Object} sjekklistekrav - The checklist requirements data to be rendered.
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Whether to enable links in the rendered element.
 * @param {Object} [component?.resourceBindings] - Resource bindings for text values.
 * @param {string} [component?.resourceBindings.trueText] - Text to display for true values.
 * @param {string} [component?.resourceBindings.falseText] - Text to display for false values.
 * @param {string} [component?.resourceBindings.defaultText] - Default text to display.
 * @returns {HTMLElement} The custom group element for the checklist requirements.
 */
export function renderSjekklistekravGroup(sjekklistekrav: Sjekklistekrav, component: InstantiatedComponent | null | undefined) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            trueText: component?.resourceBindings?.trueText,
            falseText: component?.resourceBindings?.falseText,
            defaultText: component?.resourceBindings?.defaultText
        },
        resourceValues: {
            data: sjekklistekrav
        }
    });
    return createCustomElement("custom-group-sjekklistekrav", htmlAttributes);
}

/**
 * Renders a custom paragraph element displaying the description for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component?.resourceValues] - Resource values for the component.
 * @param {string} [component?.resourceValues.description] - The description text to display.
 * @returns {HTMLElement} The custom paragraph element with the specified attributes.
 */
export function renderDescription(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.description
        },
        styleOverride: { pageBreakBefore: "avoid", pageBreakInside: "avoid", fontStyle: "italic" }
    });
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";

/**
 * Renders a custom divider element with overridden margin style.
 *
 * @returns {HTMLElement} The custom divider element.
 */
export function renderDivider() {
    const htmlAttributes = new CustomElementHtmlAttributes({
        styleOverride: { margin: 0 }
    });
    return createCustomElement("custom-divider", htmlAttributes);
}
