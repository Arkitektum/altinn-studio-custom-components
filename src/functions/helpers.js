import customElementTagNames from "../constants/customElementTagNames.js";

/**
 * Checks if the given object has a value.
 *
 * For strings, it checks if the length is greater than 0.
 * For numbers, it checks if the number is not NaN.
 * For other objects, it checks if any property has a non-empty string value.
 *
 * @param {string|number|object} obj - The object to check for a value.
 * @returns {boolean} - Returns true if the object has a value, otherwise false.
 */
export function hasValue(obj) {
    if (typeof obj === "string") {
        return obj.length > 0;
    } else if (typeof obj === "number") {
        return isNaN(obj) === false;
    }
    for (let key in obj) {
        if (!!obj?.[key]?.toString().length > 0) {
            return true;
        }
    }
    return false;
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
        return JSON.parse(texts);
    } else {
        texts = await getAsync(component, "texts");
        return texts;
    }
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
        throw new Error("Invalid tag name");
    }
    const customFieldElement = document.createElement(tagName);
    setAttributes(customFieldElement, htmlAttributes);
    return customFieldElement;
}

/**
 * Adds a container element with a specified component inside it.
 *
 * @param {HTMLElement} component - The component to be added inside the container element.
 * @returns {HTMLElement} The container element with the component inside it.
 */
export function addContainerElement(component) {
    const containerElement = document.createElement("div");
    const formContentElement = document.createElement("div");

    formContentElement.appendChild(component);
    containerElement.appendChild(formContentElement);

    addStyle(containerElement, {
        padding: "0.75rem 0"
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
                console.warn(
                    `Missing textResourceBindings.${key} for "${componentName}". Using fallback text: "${fallbackTexts[key]}"`
                );
            } else {
                console.warn(`Missing textResourceBindings.${key} for "${componentName}".`);
            }
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
function getAsync(obj, prop, timeout = 200) {
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
 * Retrieves the container element of a given component.
 *
 * @param {HTMLElement} component - The component for which to find the container element.
 * @returns {HTMLElement | null} - The container element if found, otherwise null.
 */
export function getComponentContainerElement(component) {
    const isChildComponent = component.getAttribute("isChildComponent") === "true";
    return isChildComponent ? component : component?.parentElement?.parentElement;
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
    const path = dataKey?.split(/\.|\[|\]/).filter(Boolean);
    for (let i = 0; i < path.length; i++) {
        data = data[path[i]];
    }
    return data;
}

/**
 * Retrieves the value of a text resource based on a given resource binding.
 *
 * @param {Object} textResources - The object containing text resources.
 * @param {Array} textResources.resources - An array of text resource objects.
 * @param {string} textResources.resources[].id - The unique identifier of a text resource.
 * @param {string} textResources.resources[].value - The value of the text resource.
 * @param {string} resourceBinding - The ID of the resource to retrieve.
 * @returns {string|undefined} The value of the text resource if found, otherwise undefined.
 */
export function getTextResourceFromResourceBinding(textResources, resourceBinding) {
    return textResources?.resources?.find((resource) => resource.id === resourceBinding)?.value;
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
