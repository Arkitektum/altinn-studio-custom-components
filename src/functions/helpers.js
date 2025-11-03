// Constants
import customElementTagNames from "../constants/customElementTagNames.js";

/**
 * Checks if the given object has a value.
 *
 * @param {any} obj - The object to check for a value.
 * @returns {boolean} Returns `true` if the object has a value, otherwise `false`.
 *
 * The function evaluates the following cases:
 * - `undefined` or `null`: Returns `false`.
 * - `string`: Returns `true` if the string has a length greater than 0.
 * - `number`: Returns `true` if the number is not NaN.
 * - `boolean`: Returns `true` if the value is `true`.
 * - `array`: Returns `true` if the array has a length greater than 0.
 * - `object`: Returns `true` if at least one property has a non-empty string value.
 */
export function hasValue(obj) {
    if (obj === undefined || obj === null) {
        return false;
    }
    if (typeof obj === "string") {
        return obj.length > 0;
    }
    if (typeof obj === "number") {
        return !Number.isNaN(obj);
    }
    if (typeof obj === "boolean") {
        return obj === true;
    }
    if (Array.isArray(obj)) {
        return obj.length > 0;
    }
    for (let key in obj) {
        if (!!obj?.[key]?.toString().length > 0) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if the given value is a number larger than zero.
 *
 * Converts the input to a number if it is not already, and verifies that it is a valid number greater than zero.
 *
 * @param {number|string} value - The value to check.
 * @returns {boolean} True if the value is a number greater than zero, otherwise false.
 */
export function isNumberLargerThanZero(value) {
    const num = typeof value === "number" ? value : Number(value);
    return typeof num === "number" && !Number.isNaN(num) && num > 0;
}

/**
 * Checks if the provided tag name is valid.
 *
 * @param {string} tagName - The tag name to validate.
 * @returns {boolean} True if the tag name is valid, false otherwise.
 */
function isValidTagName(tagName) {
    const validTagNames = customElementTagNames;
    return validTagNames.includes(tagName);
}

/**
 * Adds the specified styles to the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to which the styles will be applied.
 * @param {Object} style - An object containing CSS property-value pairs.
 */
export function addStyle(element, style) {
    for (let key in style) {
        element.style[key] = style[key];
    }
}

/**
 * Sets multiple attributes on a given HTML element.
 *
 * @param {HTMLElement} element - The element on which to set the attributes.
 * @param {Object} attributes - An object containing key-value pairs of attributes to set.
 */
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

/**
 * Retrieves the text for an empty field from the given component.
 *
 * @param {Object} component - The component object containing text properties.
 * @param {Object} [component.texts] - An optional object containing text definitions.
 * @param {string} [component.texts.emptyFieldText] - The text to display for an empty field.
 * @returns {string} The empty field text if defined, otherwise an empty string.
 */
export function getEmptyFieldText(component) {
    const emptyFieldText = component?.resourceValues?.emptyFieldText;
    return emptyFieldText || "";
}

/**
 * Retrieves the row number title from a component's resource bindings.
 * If the row number title is not defined, returns the default value "#".
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {string} The row number title or "#" if not defined.
 */
export function getRowNumberTitle(component) {
    const rowNumberTitle = getTextResourceFromResourceBinding(component?.resourceBindings?.rowNumberTitle);
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
 * Creates a custom HTML element with the specified tag name and attributes.
 *
 * @param {string} tagName - The name of the HTML tag to create.
 * @param {Object} htmlAttributes - An object containing key-value pairs of attributes to set on the created element.
 * @throws {Error} Throws an error if the provided tag name is invalid.
 * @returns {HTMLElement} The created custom HTML element with the specified attributes.
 */
export function createCustomElement(tagName, htmlAttributes) {
    if (!isValidTagName(tagName)) {
        throw new Error(`Invalid tag name ${tagName}. Must be one of: ${customElementTagNames.join(", ")}`);
    }
    const customFieldElement = document.createElement(tagName);
    setAttributes(customFieldElement, { ...htmlAttributes, tagName });
    return customFieldElement;
}

/**
 * Calculates the flex width percentage based on a grid configuration.
 * The function considers the grid breakpoints (xs, sm, md, lg, xl) and returns
 * the smallest width percentage among them, defaulting to 100% if no grid is provided.
 *
 * @param {Object} [grid] - The grid configuration object.
 * @param {number} [grid.xs=12] - Number of columns for extra small screens.
 * @param {number} [grid.sm=grid.xs] - Number of columns for small screens.
 * @param {number} [grid.md=grid.sm] - Number of columns for medium screens.
 * @param {number} [grid.lg=grid.md] - Number of columns for large screens.
 * @param {number} [grid.xl=grid.lg] - Number of columns for extra large screens.
 * @returns {number} The minimum flex width percentage for the given grid configuration.
 */
export function calculateFlexWidth(grid) {
    if (grid) {
        const xs = grid.xs || 12;
        const sm = grid.sm || xs;
        const md = grid.md || sm;
        const lg = grid.lg || md;
        const xl = grid.xl || lg;
        return Math.min((xs / 12) * 100, (sm / 12) * 100, (md / 12) * 100, (lg / 12) * 100, (xl / 12) * 100);
    } else {
        return 100;
    }
}

/**
 * Creates a container element with a nested form content element, applies flex and padding styles,
 * and sets the width based on the provided grid value.
 *
 * @param {HTMLElement} component - The component to be wrapped inside the container.
 * @param {Object} grid - The grid configuration object to determine the width.
 * @returns {HTMLDivElement} The styled container element containing the component.
 */
export function addContainerElement(component, grid) {
    const containerElement = document.createElement("div");
    const formContentElement = document.createElement("div");
    formContentElement.appendChild(component);
    containerElement.appendChild(formContentElement);

    const flexStyle = {
        flexBasis: "100%",
        maxWidth: "100%"
    };

    if (hasValue(grid)) {
        const flexWidth = calculateFlexWidth(grid);
        flexStyle.flexBasis = `${flexWidth}%`;
        flexStyle.maxWidth = `${flexWidth}%`;
        flexStyle.flexGrow = "0";
    }

    addStyle(containerElement, {
        ...flexStyle,
        padding: "0.75rem 0px"
    });

    return containerElement;
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
 * Retrieves the global text resources from the window object if available.
 *
 * @returns {Array} An array of text resources if `window.textResources` exists, otherwise an empty array.
 */
export function getTextResources() {
    return typeof globalThis !== "undefined" && globalThis.textResources ? globalThis.textResources : [];
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
export function validateTexts(texts, fallbackTexts, keys, componentName) {
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
export function validateFormData(data, dataKeys, componentName) {
    for (const key of dataKeys) {
        if (data[key] === undefined || data[key] === null) {
            console.warn(`Missing dataModelBindings.${key} for "${componentName}".`);
        }
    }
}

/**
 * Retrieves the container element for a given component.
 *
 * @param {HTMLElement} component - The component element for which to find the container.
 * @returns {HTMLElement | null} - The container element if found, or null if no container exists.
 *                                 If the component is marked as a child component, it returns the component itself.
 */
export function getComponentContainerElement(component) {
    const isChildComponent = component.getAttribute("isChildComponent") === "true";
    const grandParentElement = component?.parentElement?.parentElement;
    if (isChildComponent) {
        return component;
    } else if (grandParentElement) {
        return grandParentElement;
    } else {
        return null;
    }
}

/**
 * Retrieves a value from a nested data object based on a given data key.
 *
 * @param {Object} data - The data object to retrieve the value from.
 * @param {string} dataKey - The key representing the path to the value in the data object.
 *                           The key can be a dot-separated string or an array-like string with brackets.
 * @returns {*} - The value found at the specified data key path, or the original data if no data key is provided.
 */
export function getValueFromDataKey(data, dataKey) {
    if (!dataKey) {
        return data;
    }
    if (data == null) {
        return undefined;
    }
    if (/(\.\.|^\.)/.test(dataKey)) {
        return undefined; // Invalid dataKey
    }
    const keys = dataKey.split(/[.[\]]/).filter(Boolean);
    return keys.reduce((acc, key) => acc?.[key], data);
}

/**
 * Retrieves the text resource value corresponding to the given resource binding.
 * If the resource is not found, returns the resourceBinding itself.
 *
 * @param {string} resourceBinding - The ID of the resource to look up.
 * @returns {string} The value of the text resource, or the resourceBinding if not found.
 */
export function getTextResourceFromResourceBinding(resourceBinding) {
    const textResources = getTextResources();
    const textResource = textResources?.resources?.find((resource) => resource.id === resourceBinding)?.value;
    return textResource || resourceBinding;
}

/**
 * Retrieves text resources from the given resource bindings object.
 *
 * Iterates over each key in the resourceBindings object and uses
 * getTextResourceFromResourceBinding to extract the corresponding text resource.
 *
 * @param {Object} resourceBindings - An object where each key maps to a resource binding.
 * @returns {Object} An object mapping each key to its corresponding text resource.
 */
export function getTextResourcesFromResourceBindings(resourceBindings) {
    const texts = {};
    for (const key in resourceBindings) {
        texts[key] = getTextResourceFromResourceBinding(resourceBindings[key]);
    }
    return texts;
}

/**
 * Retrieves the data value from a component object.
 *
 * If the component is a child component, it returns the value from `component.resourceValues.data`.
 * Otherwise, it returns the value from `component.formData.simpleBinding` if available,
 * or falls back to `component.formData.data`.
 *
 * @param {Object} component - The component object to extract the data value from.
 * @param {boolean} component.isChildComponent - Indicates if the component is a child component.
 * @param {Object} [component.resourceValues] - Resource values for child components.
 * @param {*} [component.resourceValues.data] - Data value for child components.
 * @param {Object} [component.formData] - Form data for non-child components.
 * @param {*} [component.formData.simpleBinding] - Simple binding data for non-child components.
 * @param {*} [component.formData.data] - Data value for non-child components.
 * @returns {*} The extracted data value from the component.
 */
export function getComponentDataValue(component) {
    if (component.isChildComponent) {
        return component.resourceValues?.data;
    } else {
        if (typeof component.formData?.simpleBinding === "boolean") {
            // Special case for boolean values
            return component.formData?.simpleBinding;
        }
        return component.formData?.simpleBinding || component.formData?.data;
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
export function getComponentDataTitle(component) {
    if (component.isChildComponent) {
        return component.resourceValues?.dataTitle;
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
 * @param {Object} [component.resourceValues] - Resource values for child components.
 * @param {*} [component.resourceValues.trueData] - Data value for true state in resource values.
 * @param {*} [component.resourceValues.falseData] - Data value for false state in resource values.
 * @param {*} [component.resourceValues.defaultData] - Data value for default state in resource values.
 * @param {Object} [component.formData] - Form data for non-child components.
 * @param {*} [component.formData.trueData] - Data value for true state in form data.
 * @param {*} [component.formData.falseData] - Data value for false state in form data.
 * @param {*} [component.formData.defaultData] - Data value for default state in form data.
 * @returns {Object} An object containing `trueData`, `falseData`, and `defaultData`.
 */
export function getComponentBooleanDataValues(component) {
    if (component.isChildComponent) {
        return {
            trueData: component.resourceValues?.trueData,
            falseData: component.resourceValues?.falseData,
            defaultData: component.resourceValues?.defaultData
        };
    }
    return {
        trueData: component.formData?.trueData,
        falseData: component.formData?.falseData,
        defaultData: component.formData?.defaultData
    };
}

/**
 * Retrieves the boolean text values (trueText, falseText, defaultText) for a given component.
 * It prioritizes values from `component.resourceValues`, and falls back to values
 * obtained via `getTextResourceFromResourceBinding` using the corresponding resource bindings.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - Direct text values for true, false, and default states.
 * @param {string} [component.resourceValues.trueText] - Text to display for the true state.
 * @param {string} [component.resourceValues.falseText] - Text to display for the false state.
 * @param {string} [component.resourceValues.defaultText] - Text to display for the default state.
 * @param {Object} [component.resourceBindings] - Resource bindings for true, false, and default states.
 * @param {string} [component.resourceBindings.trueText] - Resource binding for the true state.
 * @param {string} [component.resourceBindings.falseText] - Resource binding for the false state.
 * @param {string} [component.resourceBindings.defaultText] - Resource binding for the default state.
 * @returns {Object} An object containing `trueText`, `falseText`, and `defaultText` properties.
 */
export function getComponentBooleanTextValues(component) {
    return {
        trueText: component.resourceValues?.trueText || getTextResourceFromResourceBinding(component?.resourceBindings?.trueText),
        falseText: component.resourceValues?.falseText || getTextResourceFromResourceBinding(component?.resourceBindings?.falseText),
        defaultText: component.resourceValues?.defaultText || getTextResourceFromResourceBinding(component?.resourceBindings?.defaultText)
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
export function getComponentResourceValue(component, resourceKey) {
    if (hasValue(component?.resourceValues?.[resourceKey])) {
        return component.resourceValues?.[resourceKey];
    } else {
        return getTextResourceFromResourceBinding(component?.resourceBindings?.[resourceKey]);
    }
}

/**
 * Appends an array of children to a parent element. If a child is an instance of HTMLElement,
 * it is appended using `appendChild`. Otherwise, the child's content is appended to the parent's
 * innerHTML.
 *
 * @param {HTMLElement} parent - The parent element to which the children will be appended.
 * @param {Array<HTMLElement|string>} children - An array of children to append. Each child can be
 * either an HTMLElement or a string.
 * @returns {HTMLElement} The parent element after appending the children.
 */
export function appendChildren(parent, children) {
    const filteredChildren = children.filter((child) => !!child);
    for (const child of filteredChildren) {
        if (child instanceof HTMLElement) {
            parent.appendChild(child);
        } else {
            parent.innerHTML += child;
        }
    }
    return parent;
}
