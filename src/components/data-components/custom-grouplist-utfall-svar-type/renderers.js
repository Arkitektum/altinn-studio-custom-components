// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom group element for a specific "utfall svar type" using the provided component and key.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {string} utfallTypeKey - The key representing the specific "utfall svar type" to render.
 * @returns {HTMLElement} The custom element representing the group for the specified "utfall svar type".
 */
export function renderUtfallSvarType(component, utfallTypeKey) {
    const data = component?.resourceValues?.data[utfallTypeKey];
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.[utfallTypeKey?.toLocaleLowerCase()]?.title,
            kommentar: component?.resourceBindings?.kommentar,
            tema: component?.resourceBindings?.tema,
            utfallSvarStatus: component?.resourceBindings?.utfallSvarStatus,
            vedleggsliste: component?.resourceBindings?.vedleggsliste
        },
        resourceValues: {
            data,
            utfallType: utfallTypeKey
        }
    });
    return createCustomElement("custom-group-utfall-svar-type", htmlAttributes);
}
