// Dependencies
import { addStyle, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders an image element (optionally with a caption) from the component's resolved source.
 *
 * @param {Object} component - The instantiated CustomFieldImage component.
 * @returns {HTMLElement} A container element holding an optional caption and the image.
 */
export function renderImageElement(component) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("custom-field-image");

    const title = component?.resourceValues?.title;
    if (hasValue(title)) {
        const titleElement = document.createElement("div");
        titleElement.classList.add("custom-field-image-title");
        titleElement.innerText = title;
        containerElement.appendChild(titleElement);
    }

    const src = component?.resourceValues?.data;
    if (hasValue(src)) {
        const imageElement = document.createElement("img");
        imageElement.classList.add("custom-field-image-img");
        imageElement.src = src;
        imageElement.alt = hasValue(component?.alt) ? component.alt : hasValue(title) ? title : "";
        addStyle(imageElement, component?.styleOverride);
        containerElement.appendChild(imageElement);
    }

    return containerElement;
}
