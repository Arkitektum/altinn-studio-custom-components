// Dependencies
import type { ComponentProps, InstantiatedComponent } from "../types.ts";
import { addStyle, getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Checks if the given value is a number larger than zero.
 *
 * Converts the input to a number if it is not already, and verifies that it is a valid number greater than zero.
 *
 * @param {number|string} value - The value to check.
 * @returns {boolean} True if the value is a number greater than zero, otherwise false.
 */
export function isNumberLargerThanZero(value: unknown): boolean {
    const num = typeof value === "number" ? value : Number(value);
    return typeof num === "number" && !Number.isNaN(num) && num > 0;
}

/**
 * Retrieves the text for an empty field from the given component.
 *
 * @param {Object} component - The component object containing text properties.
 * @param {Object} [component.texts] - An optional object containing text definitions.
 * @param {string} [component.texts.emptyFieldText] - The text to display for an empty field.
 * @returns {string} The empty field text if defined, otherwise an empty string.
 */
export function getEmptyFieldText(component?: InstantiatedComponent | null): string | undefined {
    const emptyFieldText = (component?.resourceValues as Record<string, unknown> | undefined)?.emptyFieldText as string | undefined;
    return emptyFieldText || "";
}

/**
 * Retrieves the row number title from a component's resource bindings.
 * If the row number title is not defined, returns the default value "#".
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {string} The row number title or "#" if not defined.
 */
export function getRowNumberTitle(component?: InstantiatedComponent | null): string | undefined {
    const rowNumberTitle = getTextResourceFromResourceBinding(
        (component?.resourceBindings as Record<string, unknown> | undefined)?.rowNumberTitle as string | undefined
    );
    return rowNumberTitle || "#";
}

/**
 * Generates a unique identifier string, optionally prefixed.
 *
 * The identifier is composed of the current timestamp (in base36)
 * and a random string (also in base36), ensuring uniqueness.
 *
 * @param {string} [prefix=""] - Optional prefix to prepend to the unique ID.
 * @returns {string} A unique identifier string.
 */
export function generateUniqueId(prefix = "") {
    const timestamp = Date.now().toString(36); // base36 for compactness
    const random = Math.random().toString(36).substring(2, 10); // skip "0."
    return `${prefix}${timestamp}${random}`;
}

/**
 * Creates and returns a layout container element with predefined styles.
 *
 * The container element is a `div` with the following styles applied:
 * - `display: "flex"`
 * - `flexFlow: "wrap"`
 * - `justifyContent: "start"`
 * - `alignItems: "flex-start"`
 *
 * @returns {HTMLDivElement} The styled container element.
 */
export function renderLayoutContainerElement() {
    const containerElement = document.createElement("div");
    addStyle(containerElement, {
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "start",
        alignItems: "flex-start"
    });
    return containerElement;
}

/**
 * Validates the presence of text resources for the given keys in the texts object.
 * If a text resource is missing, it checks for a fallback text and logs a warning.
 *
 * @param {Object} texts - The main texts object containing text resources.
 * @param {Object} fallbackTexts - The fallback texts object containing fallback text resources.
 * @param {Array<string>} keys - An array of keys to validate in the texts object.
 * @param {string} componentName - The name of the component for which the texts are being validated.
 */
export function validateTexts(
    texts: Record<string, unknown>,
    fallbackTexts: Record<string, unknown>,
    keys: string[],
    componentName: string
): void {
    for (const key of keys) {
        if (texts[key] === undefined || texts[key] === null) {
            if (fallbackTexts?.[key] !== undefined && fallbackTexts?.[key] !== null) {
                console.warn(`Missing textResourceBindings.${key} for "${componentName}". Using fallback text: "${fallbackTexts[key]}"`);
            } else {
                console.warn(`Missing textResourceBindings.${key} for "${componentName}".`);
            }
        }
    }
}

/**
 * Validates the provided form data against the specified data keys.
 * Logs a warning if any key in `dataKeys` is missing or has a value of `undefined` or `null` in the `data`.
 *
 * @param {Object} data - The form data object to validate.
 * @param {string[]} dataKeys - An array of keys to check in the form data.
 * @param {string} componentName - The name of the component for context in warning messages.
 */
export function validateFormData(data: Record<string, unknown>, dataKeys: string[], componentName: string): void {
    for (const key of dataKeys) {
        if (data[key] === undefined || data[key] === null) {
            console.warn(`Missing dataModelBindings.${key} for "${componentName}".`);
        }
    }
}

/**
 * Finds the nearest element, starting at `element` itself, whose `data-summary-target` equals `id`.
 *
 * This walks the ancestor chain rather than using `closest()` with an interpolated attribute selector: an `id` is
 * author-controlled through the layout JSON, and one containing a quote or backslash makes the selector invalid, so
 * `closest()` throws a `SyntaxError` that escapes `connectedCallback` and aborts the whole component render.
 * Comparing attribute values directly cannot throw and needs no CSS escaping.
 *
 * Only meaningful for a non-empty `id`; see `getComponentContainerElement` for why an empty one cannot be resolved
 * by walking ancestors.
 *
 * @param {HTMLElement} element - The element to start searching from.
 * @param {string} id - The non-empty component id the container is expected to target.
 * @returns {HTMLElement | null} The matching element, or null when there is none.
 */
function findSummaryTargetElement(element: HTMLElement | null, id: string): HTMLElement | null {
    for (let current = element; current; current = current.parentElement) {
        if (current.getAttribute?.("data-summary-target") === id) {
            return current;
        }
    }
    return null;
}

/**
 * How far above an id-less component its own container can sit: `addContainerElement` nests the component two
 * levels inside it (container → content → component), and a container may also wrap it directly.
 */
const EMPTY_ID_CONTAINER_MAX_DEPTH = 2;

/**
 * Retrieves the container element for a given component.
 *
 * An `id` is optional in the layout JSON, and `addContainerElement` sets `data-summary-target` from whatever the
 * component's id is — so every id-less component's container targets the empty string. Walking the whole ancestor
 * chain for `""` would therefore match the *first* id-less container above the component, however far up that is,
 * which need not be its own: for a component nested well below its wrapper that is another component's container,
 * and the caller goes on to hide or even remove it along with everything else inside.
 *
 * An empty id is therefore resolved within the depth its own container can occupy: the component itself, a
 * container wrapping it directly, or the `addContainerElement` shape (container → content → component). Anything
 * further up cannot belong to it.
 *
 * @param {HTMLElement} component - The component element for which to find the container.
 * @returns {HTMLElement | null} - The container element if found, or null if no container exists.
 *                                 If the component is marked as a child component, it returns the component itself.
 */
export function getComponentContainerElement(component: HTMLElement): HTMLElement | null {
    const isChildComponent = component.getAttribute("isChildComponent") === "true";
    if (isChildComponent) {
        return component;
    }
    if (!component.id) {
        // The component itself, its parent, or its grandparent — the deepest an id-less component sits inside its
        // own container. Bounded rather than walking to the first empty-target container anywhere above it.
        let current: HTMLElement | null = component;
        for (let depth = 0; current && depth <= EMPTY_ID_CONTAINER_MAX_DEPTH; depth++, current = current.parentElement) {
            if (current.getAttribute?.("data-summary-target") === "") {
                return current;
            }
        }
        return null;
    }
    return findSummaryTargetElement(component, component.id);
}

/**
 * Retrieves the data value from a component object.
 *
 * If the component is a child component, it returns the value from `component?.resourceValues.data`.
 * Otherwise, it returns the value from `component.formData.simpleBinding` if available,
 * or falls back to `component.formData.data`.
 *
 * @param {Object} component - The component object to extract the data value from.
 * @param {boolean} component.isChildComponent - Indicates if the component is a child component.
 * @param {Object} [component?.resourceValues] - Resource values for child components.
 * @param {*} [component?.resourceValues.data] - Data value for child components.
 * @param {Object} [component.formData] - Form data for non-child components.
 * @param {*} [component.formData.simpleBinding] - Simple binding data for non-child components.
 * @param {*} [component.formData.data] - Data value for non-child components.
 * @returns {*} The extracted data value from the component.
 */
export function getComponentDataValue(component: ComponentProps): unknown {
    if (component.isChildComponent) {
        return component?.resourceValues?.data;
    } else {
        if (typeof component.formData?.simpleBinding === "boolean") {
            // Special case for boolean values
            return component.formData?.simpleBinding;
        }
        // Use nullish coalescing so legitimate falsy values (0, "") from simpleBinding are not discarded.
        return component.formData?.simpleBinding ?? component.formData?.data;
    }
}
/**
 * Retrieves the data title from a component's formData if it exists.
 *
 * @param {Object} component - The component object containing formData.
 * @param {Object} [component.formData] - The formData object of the component.
 * @param {string} [component.formData.dataTitle] - The data title to retrieve.
 * @returns {string|undefined} The data title if present, otherwise undefined.
 */
export function getComponentDataTitle(component: ComponentProps): unknown {
    if (component.isChildComponent) {
        return component?.resourceValues?.dataTitle;
    } else if (component.formData?.dataTitle != null) {
        return component.formData?.dataTitle;
    }
}

/**
 * Retrieves boolean data values (trueData, falseData, defaultData) from a component object.
 * If the component is a child component, values are taken from `resourceValues`.
 * Otherwise, values are taken from `formData`.
 *
 * @param {Object} component - The component object to extract data from.
 * @param {boolean} component.isChildComponent - Indicates if the component is a child component.
 * @param {Object} [component?.resourceValues] - Resource values for child components.
 * @param {*} [component?.resourceValues.trueData] - Data value for true state in resource values.
 * @param {*} [component?.resourceValues.falseData] - Data value for false state in resource values.
 * @param {*} [component?.resourceValues.defaultData] - Data value for default state in resource values.
 * @param {Object} [component.formData] - Form data for non-child components.
 * @param {*} [component.formData.trueData] - Data value for true state in form data.
 * @param {*} [component.formData.falseData] - Data value for false state in form data.
 * @param {*} [component.formData.defaultData] - Data value for default state in form data.
 * @returns {Object} An object containing `trueData`, `falseData`, and `defaultData`.
 */
export function getComponentBooleanDataValues(component: ComponentProps): unknown {
    if (component.isChildComponent) {
        return {
            trueData: component?.resourceValues?.trueData,
            falseData: component?.resourceValues?.falseData,
            defaultData: component?.resourceValues?.defaultData
        };
    }
    return {
        trueData: component.formData?.trueData,
        falseData: component.formData?.falseData,
        defaultData: component.formData?.defaultData
    };
}

/**
 * Retrieves boolean text values (true, false, default) for a component, prioritizing direct resource values,
 * and falling back to resource bindings if not present.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} resourceBindings - The resource bindings object for fallback text resources.
 * @returns {Object} An object containing `trueText`, `falseText`, and `defaultText` strings.
 */
export function getComponentBooleanTextValues(component: ComponentProps, resourceBindings?: Record<string, unknown>): unknown {
    return {
        trueText: component?.resourceValues?.trueText || getTextResourceFromResourceBinding(resourceBindings?.trueText as string | undefined),
        falseText: component?.resourceValues?.falseText || getTextResourceFromResourceBinding(resourceBindings?.falseText as string | undefined),
        defaultText: component?.resourceValues?.defaultText || getTextResourceFromResourceBinding(resourceBindings?.defaultText as string | undefined)
    };
}

/**
 * Retrieves the value of a resource for a given component and resource key.
 * If the value exists in the component's `resourceValues`, it is returned.
 * Otherwise, attempts to retrieve the value from the component's `resourceBindings`.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {string} resourceKey - The key identifying the resource to retrieve.
 * @returns {*} The value of the resource, or the result from the resource binding lookup.
 */
export function getComponentResourceValue(component: ComponentProps, resourceKey: string): unknown {
    if (hasValue(component?.resourceValues?.[resourceKey])) {
        return component?.resourceValues?.[resourceKey];
    } else {
        return getTextResourceFromResourceBinding(component?.resourceBindings?.[resourceKey] as string | undefined);
    }
}

/**
 * Adjusts an HTML header size (e.g., "h2") by a given offset, ensuring the result stays within valid header levels (h1-h6).
 *
 * @param {string} initialHeaderSize - The initial header size as a string (e.g., "h2").
 * @param {number} offset - The amount to adjust the header size by (positive or negative).
 * @returns {string} The adjusted header size as a string (e.g., "h3"), clamped between "h1" and "h6".
 */
export function getAdjustedHeaderSize(initialHeaderSize: string, offset: number): string {
    const initialNumber = Number.parseInt(initialHeaderSize.toLowerCase().replace("h", ""), 10);
    let adjustedNumber = initialNumber + offset;
    if (adjustedNumber < 1) {
        adjustedNumber = 1;
    } else if (adjustedNumber > 6) {
        adjustedNumber = 6;
    }
    return `h${adjustedNumber}`;
}
