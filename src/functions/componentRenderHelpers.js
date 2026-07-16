// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "./devToolsHelpers.js";
import { getComponentContainerElement } from "./helpers.js";
import { instantiateComponent } from "./componentHelpers.js";
import { renderFeedbackListElement } from "./feedbackHelpers.js";

// Constants
import { allowedFormDataKeysForTypes, allowedResourceValuesKeysForTypes } from "../constants/allowedPropertyKeys.js";

/**
 * Validates the `formData` object of a component based on its type.
 *
 * @param {Object} formData - The form data to validate.
 * @param {string} type - The component type (e.g., "base", "data", "layout").
 * @param {string} componentName - The name of the component.
 * @returns {void}
 */
function validateFormData(formData, type, componentName) {
    if (!formData) {
        return;
    }
    const allowedKeys = allowedFormDataKeysForTypes[type] || [];
    const extraKeys = Object.keys(formData).filter((key) => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        console.error(`Component ${componentName} of type ${type} has unrecognized formData keys: ${extraKeys.join(", ")}`);
    }
}

/**
 * Validates the `resourceValues` object of a component based on its type.
 *
 * @param {Object} resourceValues - The resource values to validate.
 * @param {string} type - The component type (e.g., "base", "data", "layout").
 * @param {string} componentName - The name of the component.
 * @returns {void}
 */
function validateResourceValues(resourceValues, type, componentName) {
    if (!resourceValues) {
        return;
    }
    const allowedKeys = allowedResourceValuesKeysForTypes[type] || [];
    const extraKeys = Object.keys(resourceValues).filter((key) => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        console.error(`Component ${componentName} of type ${type} has unrecognized resourceValues keys: ${extraKeys.join(", ")}`);
    }
}

/**
 * Validates the `formData` and `resourceValues` attributes of a custom element based on its type.
 *
 * @param {HTMLElement} host - The custom element instance.
 * @param {string} type - The component type (e.g., "base", "data", "layout").
 */
export function validateHostDataAttributes(host, type) {
    const componentName = host?.tagName?.toLowerCase() || "unknown";
    const formData = host.getAttribute("formdata") ? JSON.parse(host.getAttribute("formdata")) : null;
    const resourceValues = host.getAttribute("resourcevalues") ? JSON.parse(host.getAttribute("resourcevalues")) : null;
    validateFormData(formData, type, componentName);
    validateResourceValues(resourceValues, type, componentName);
}

/**
 * Runs the shared render lifecycle used by (almost) every custom element's `connectedCallback`:
 *
 * 1. Instantiate the component class from the element's attributes.
 * 2. If the component resolves to empty and should be hidden, hide its container (or, in DevTools mode, render a
 *    hidden-element placeholder badge). By default this is gated on the component's `hideIfEmpty` flag; pass
 *    `alwaysHideWhenEmpty` to hide whenever the component is empty regardless of the flag.
 * 3. Otherwise invoke the component-specific `render` callback and attach the DevTools overlay.
 * 4. Optionally append a validation feedback list when `withFeedback` is set and the component has messages.
 *
 * Component-specific markup lives entirely in the `render` callback, so callers keep full control over how
 * (and whether) they clear/append content.
 *
 * @param {HTMLElement} host - The custom element instance (`this` inside `connectedCallback`).
 * @param {Object} options - Lifecycle options.
 * @param {string} options.type - DevTools category: "base", "data", or "layout".
 * @param {(host: HTMLElement, component: Object) => void} options.render - Renders the component's content into `host`.
 * @param {boolean} [options.withFeedback=false] - When true, append a feedback list if the component has validation messages.
 * @param {boolean} [options.alwaysHideWhenEmpty=false] - When true, hide an empty component regardless of its `hideIfEmpty` flag.
 * @returns {Object} The instantiated component.
 */
export function renderCustomComponent(host, { type, render, withFeedback = false, alwaysHideWhenEmpty = false }) {
    validateHostDataAttributes(host, type);
    const component = instantiateComponent(host);
    const componentContainerElement = getComponentContainerElement(host);
    const shouldHideWhenEmpty = alwaysHideWhenEmpty || component?.hideIfEmpty;
    if (shouldHideWhenEmpty && component?.isEmpty && !!componentContainerElement) {
        if (isDevMode()) {
            const hiddenEl = renderHiddenDevToolsElement(host, component, type);
            if (hiddenEl) host.appendChild(hiddenEl);
        } else {
            componentContainerElement.style.display = "none";
        }
    } else {
        render(host, component);
        addDevToolsOverlay(host, component, type);
    }
    if (withFeedback && component?.hasValidationMessages) {
        const feedbackListElement = renderFeedbackListElement(component?.validationMessages);
        if (feedbackListElement) {
            host.appendChild(feedbackListElement);
        }
    }
    return component;
}
