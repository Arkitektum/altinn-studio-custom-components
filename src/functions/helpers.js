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
        return isNaN(obj) === false;
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
 * Checks if the given value is a number and larger than zero.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a number and greater than zero, otherwise `false`.
 */
export function isNumberLargerThanZero(value) {
    return typeof value === "number" && value > 0;
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
 * Retrieves the texts associated with a given component.
 *
 * This function first attempts to get the texts from the component's "texts" attribute.
 * If the attribute is not present, it fetches the texts asynchronously.
 *
 * @param {HTMLElement} component - The component from which to retrieve the texts.
 * @returns {Promise<Object>} A promise that resolves to the texts object.
 */
export async function getComponentTexts(component) {
    let texts = component.getAttribute("texts");
    if (texts) {
        try {
            return JSON.parse(texts);
        } catch (error) {
            throw new Error("Invalid JSON");
        }
    } else {
        texts = await getAsync(component, "texts");
        return texts;
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
    const emptyFieldText = component?.texts?.emptyFieldText;
    return emptyFieldText || "";
}

/**
 * Retrieves the row number title from a given component object.
 *
 * @param {Object} component - The component object containing text properties.
 * @param {Object} [component.texts] - An optional object containing text-related properties.
 * @param {string} [component.texts.rowNumberTitle] - The specific title for the row number.
 * @returns {string} The row number title if defined, otherwise the default value "#".
 */
export function getRowNumberTitle(component) {
    const rowNumberTitle = component?.texts?.rowNumberTitle;
    return rowNumberTitle || "#";
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
    setAttributes(customFieldElement, htmlAttributes);
    return customFieldElement;
}

/**
 * Creates a container element with a nested form content element, applies styles,
 * and appends the provided component to the form content element.
 *
 * @param {HTMLElement} component - The component to be added inside the container.
 * @param {boolean} flex - A flag indicating whether to apply flex-based styles.
 * @returns {HTMLElement} The container element with the nested component.
 */
export function addContainerElement(component, flex) {
    const containerElement = document.createElement("div");
    const formContentElement = document.createElement("div");
    formContentElement.appendChild(component);
    containerElement.appendChild(formContentElement);

    const flexStyle = hasValue(flex)
        ? {
              flexGrow: "0",
              maxWidth: "50%",
              flexBasis: "50%"
          }
        : {
              flexBasis: "100%",
              maxWidth: "100%"
          };

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
 * Validates the presence of text resources for the given keys in the texts object.
 * If a text resource is missing, it checks for a fallback text and logs a warning.
 *
 * @param {Object} texts - The main texts object containing text resources.
 * @param {Object} fallbackTexts - The fallback texts object containing fallback text resources.
 * @param {Array<string>} keys - An array of keys to validate in the texts object.
 * @param {string} componentName - The name of the component for which the texts are being validated.
 */
export function validateTexts(texts, fallbackTexts, keys, componentName) {
    keys.forEach((key) => {
        if (texts[key] === undefined || texts[key] === null) {
            if (fallbackTexts?.[key] !== undefined && fallbackTexts?.[key] !== null) {
                console.warn(`Missing textResourceBindings.${key} for "${componentName}". Using fallback text: "${fallbackTexts[key]}"`);
            } else {
                console.warn(`Missing textResourceBindings.${key} for "${componentName}".`);
            }
        }
    });
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
    dataKeys.forEach((key) => {
        if (data[key] === undefined || data[key] === null) {
            console.warn(`Missing dataModelBindings.${key} for "${componentName}".`);
        }
    });
}

/**
 * Waits for a property to be set on an object within a specified timeout.
 *
 * @param {Object} obj - The object to watch for the property.
 * @param {string} prop - The property to watch for.
 * @param {number} [timeout=200] - The time in milliseconds to wait before rejecting the promise.
 * @returns {Promise<any>} A promise that resolves with the value of the property once it is set, or rejects if the timeout is reached.
 * @throws {Error} If the timeout is reached before the property is set.
 */
export function getAsync(obj, prop, timeout = 200) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout: ${prop} was not set within ${timeout}ms`));
        }, timeout);

        if (typeof obj[prop] === "undefined") {
            Object.defineProperty(obj, prop, {
                set: (value) => {
                    clearTimeout(timer);
                    Object.defineProperty(obj, prop, { value });
                    resolve(value);
                },
                configurable: true,
                enumerable: true
            });
        } else {
            clearTimeout(timer);
            resolve(obj[prop]);
        }
    });
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
    } else if (!!grandParentElement) {
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
    const keys = dataKey.split(/\.|\[|\]/).filter(Boolean);
    return keys.reduce((acc, key) => acc && acc[key], data);
}

/**
 * Retrieves the text resource value corresponding to a given resource binding.
 *
 * @param {Object} textResources - The object containing text resources.
 * @param {Array} textResources.resources - An array of text resource objects.
 * @param {string} textResources.resources[].id - The unique identifier for a text resource.
 * @param {string} textResources.resources[].value - The value of the text resource.
 * @param {string} resourceBinding - The identifier of the resource binding to look up.
 * @returns {string} The value of the text resource if found, otherwise the resource binding itself.
 */
export function getTextResourceFromResourceBinding(textResources, resourceBinding) {
    const textResource = textResources?.resources?.find((resource) => resource.id === resourceBinding)?.value;
    return textResource || resourceBinding;
}

/**
 * Extracts text resources based on the provided resource bindings.
 *
 * @param {Object} textResources - An object containing all available text resources.
 * @param {Object} resourceBindings - An object where keys represent resource names and values are bindings to specific text resources.
 * @returns {Object} An object where keys are the same as in `resourceBindings` and values are the corresponding text resources.
 */
export function getTextResourcesFromResourceBindings(textResources, resourceBindings) {
    const texts = {};
    for (const key in resourceBindings) {
        texts[key] = getTextResourceFromResourceBinding(textResources, resourceBindings[key]);
    }
    return texts;
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
    children
        .filter((child) => !!child)
        .forEach((child) => {
            if (child instanceof HTMLElement) {
                parent.appendChild(child);
            } else {
                parent.innerHTML += child;
            }
        });
    return parent;
}
