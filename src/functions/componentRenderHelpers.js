// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "./devToolsHelpers.js";
import { getComponentContainerElement } from "./helpers.js";
import { hasRenderedContent } from "./htmlElementHelpers.js";
import { instantiateComponent } from "./componentHelpers.js";
import { renderFeedbackListElement } from "./feedbackHelpers.js";

// Constants
import { allowedFormDataKeysForTypes, allowedResourceValuesKeysForTypes } from "../constants/allowedPropertyKeys.js";

/**
 * Reminder appended to validation errors, pointing developers at the standardized way to pass and read primary data.
 */
const DATA_CONTRACT_HINT =
    'Primary data must be passed as formData.simpleBinding, formData.data or resourceValues.data, and read via getComponentDataValue(). ' +
    "If a key is legitimately needed, add it to allowedPropertyKeys.js.";

/**
 * Safely reads and parses a JSON attribute from the host element.
 *
 * Unlike a bare `JSON.parse`, malformed JSON is reported and swallowed instead of thrown, so a bad attribute
 * never aborts the render.
 *
 * @param {HTMLElement} host - The custom element instance.
 * @param {string} attributeName - The (lower-case) attribute name to read.
 * @param {string} componentName - The name of the component, used in error messages.
 * @returns {Object|null} The parsed object, or null if absent/invalid.
 */
function parseHostJsonAttribute(host, attributeName, componentName) {
    const raw = host?.getAttribute(attributeName);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch {
        console.error(`Component ${componentName} has invalid JSON in its "${attributeName}" attribute.`);
        return null;
    }
}

/**
 * Validates the `formData` object of a component based on its type.
 *
 * @param {Object} formData - The form data to validate.
 * @param {string} type - The component type (e.g., "base", "data", "layout").
 * @param {string} componentName - The name of the component.
 * @returns {void}
 */
function validateFormData(formData, type, componentName) {
    const allowedKeys = allowedFormDataKeysForTypes[type];
    // `null` (or an unconfigured type) means "allow all keys" — skip validation.
    if (!formData || allowedKeys == null) {
        return;
    }
    const extraKeys = Object.keys(formData).filter((key) => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        console.error(
            `Component ${componentName} of type "${type}" has unrecognized formData keys: ${extraKeys.join(", ")}. ${DATA_CONTRACT_HINT}`
        );
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
    const allowedKeys = allowedResourceValuesKeysForTypes[type];
    // `null` (or an unconfigured type) means "allow all keys" — skip validation.
    if (!resourceValues || allowedKeys == null) {
        return;
    }
    const extraKeys = Object.keys(resourceValues).filter((key) => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        console.error(
            `Component ${componentName} of type "${type}" has unrecognized resourceValues keys: ${extraKeys.join(", ")}. ${DATA_CONTRACT_HINT}`
        );
    }
}

/**
 * Validates the `formData` and `resourceValues` attributes of a custom element based on its type.
 *
 * This is a developer-facing guard rail: it reminds authors of new components to pass primary data only through
 * the standardized channels (`formData.simpleBinding`, `formData.data`, `resourceValues.data`) and read it via
 * `getComponentDataValue`. It logs in every environment so mistakes surface wherever a component runs, and it
 * never throws — malformed JSON is reported and ignored rather than aborting the render.
 *
 * @param {HTMLElement} host - The custom element instance.
 * @param {string} type - The component type (e.g., "base", "data", "layout").
 */
export function validateHostDataAttributes(host, type) {
    const componentName = host?.tagName?.toLowerCase() || "unknown";
    const formData = parseHostJsonAttribute(host, "formdata", componentName);
    const resourceValues = parseHostJsonAttribute(host, "resourcevalues", componentName);
    validateFormData(formData, type, componentName);
    validateResourceValues(resourceValues, type, componentName);
}

/**
 * The DevTools category for whole-form layout components.
 *
 * Layout components are treated differently from base and data components when they turn out to be empty: their
 * `hideIfEmpty` defaults to true, since an empty whole-form layout is never meaningful, and they are removed from
 * the document rather than merely hidden, so no stray tag is left behind in the summary view or the generated PDF.
 */
const LAYOUT_TYPE = "layout";

/**
 * Resolves the effective `hideIfEmpty` flag for a component.
 *
 * An explicit `hideIfEmpty` attribute on the host always wins, so a layout opts out with `hideIfEmpty="false"`. With
 * the attribute absent, layout components default to true and every other type falls back to the flag its component
 * class resolved from its props. The attribute is read from the host rather than taken from the component because the
 * component classes deliberately drop falsy props, which would make an explicit `false` indistinguishable from absent.
 *
 * @param {HTMLElement} host - The custom element instance.
 * @param {Object} component - The instantiated component.
 * @param {string} type - The component type ("base", "data" or "layout").
 * @returns {boolean} True when the component should hide itself while empty.
 */
function resolveHideIfEmpty(host, component, type) {
    const attributeValue = host?.getAttribute?.("hideIfEmpty");
    if (attributeValue !== null && attributeValue !== undefined) {
        return attributeValue === "true" || attributeValue === "";
    }
    return type === LAYOUT_TYPE || !!component?.hideIfEmpty;
}

/**
 * Removes an empty component from the document.
 *
 * The container is preferred over the host when one exists, mirroring which element would otherwise have been
 * hidden — removing only the host would leave an empty wrapper behind.
 *
 * @param {HTMLElement} host - The custom element instance.
 * @param {HTMLElement|null} componentContainerElement - The component's container element, when it has one.
 * @returns {void}
 */
function removeEmptyComponentElement(host, componentContainerElement) {
    const elementToRemove = componentContainerElement || host;
    elementToRemove?.remove?.();
}

/**
 * Runs the shared render lifecycle used by (almost) every custom element's `connectedCallback`:
 *
 * 1. Instantiate the component class from the element's attributes.
 * 2. If the component resolves to empty and should be hidden, skip the render and hide its container (or, in DevTools
 *    mode, render a hidden-element placeholder badge). This is gated on the effective `hideIfEmpty` flag — true by
 *    default for layout components, otherwise taken from the component — and `alwaysHideWhenEmpty` forces it on.
 * 3. Otherwise invoke the component-specific `render` callback and attach the DevTools overlay.
 * 4. Optionally append a validation feedback list when `withFeedback` is set and the component has messages.
 * 5. For layout components, drop the element entirely when nothing was rendered inside it.
 *
 * Layout components are removed from the document instead of being hidden, because hiding relies on a container that
 * a top-level layout usually does not have, and because a hidden-but-present tag still leaves a gap behind. The
 * emptiness check runs on the rendered output, so a layout whose data is present but whose every child resolved to
 * empty is dropped too. It runs last on purpose: the DevTools overlay and the feedback list both count as content, so
 * a layout that has validation messages to show is kept.
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
 * @param {boolean} [options.validateData=true] - When false, skip data-attribute key validation. Use for components
 *   whose `formData` keys are dynamic (e.g. one binding per row) and therefore can't be described by a fixed allow-list.
 * @returns {Object} The instantiated component.
 */
export function renderCustomComponent(host, { type, render, withFeedback = false, alwaysHideWhenEmpty = false, validateData = true }) {
    if (validateData) {
        validateHostDataAttributes(host, type);
    }
    const component = instantiateComponent(host);
    const componentContainerElement = getComponentContainerElement(host);
    const isLayout = type === LAYOUT_TYPE;
    const shouldHideWhenEmpty = alwaysHideWhenEmpty || resolveHideIfEmpty(host, component, type);
    // A layout is removed rather than hidden, so unlike the other types it does not need a container to hide.
    const canHideWhenEmpty = isLayout || !!componentContainerElement;
    if (shouldHideWhenEmpty && component?.isEmpty && canHideWhenEmpty) {
        if (isDevMode()) {
            const hiddenEl = renderHiddenDevToolsElement(host, component, type);
            if (hiddenEl) host.appendChild(hiddenEl);
        } else if (!isLayout) {
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
    if (isLayout && shouldHideWhenEmpty && !isDevMode() && !hasRenderedContent(host)) {
        removeEmptyComponentElement(host, componentContainerElement);
    }
    return component;
}
