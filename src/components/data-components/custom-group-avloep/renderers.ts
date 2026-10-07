import type Avloep from "../../../classes/data-classes/Avloep.ts";
import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../shared/childElements.ts";

/**
 * Renders this component's heading, at h3 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} title - The heading's text.
 * @param {string} [size="h3"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title: string, size = "h3") {
    return renderChildHeaderElement(title, size);
}

/**
 * Renders a custom element for displaying the "tilknytningstype" field of a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - The resource values associated with the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing "tilknytningstype".
 * @param {Object} [component?.resourceValues.data.tilknytningstype] - The tilknytningstype object.
 * @param {string} [component?.resourceValues.data.tilknytningstype.kodebeskrivelse] - The description code for tilknytningstype.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component?.resourceBindings.tilknytningstype] - The tilknytningstype resource binding.
 * @param {string} [component?.resourceBindings.tilknytningstype.title] - The title for the tilknytningstype field.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderTilknytningstypeElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Avloep | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.tilknytningstype?.title
        },
        resourceValues: {
            data: data?.tilknytningstype?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom boolean text field for the "Krysser Avløp Annens Grunn" element.
 *
 * This function creates a custom field component that displays a boolean value with localized text,
 * using resource bindings and values from the provided component object.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component?.resourceValues] - The resource values for the component.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderKrysserAvloepAnnensGrunnElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Avloep | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.krysserAvloepAnnensGrunn?.title,
            trueText: component?.resourceBindings?.krysserAvloepAnnensGrunn?.trueText,
            falseText: component?.resourceBindings?.krysserAvloepAnnensGrunn?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.krysserAvloepAnnensGrunn
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "Har Tinglyst Erklæring".
 *
 * This function creates a custom element with specific HTML attributes and resource bindings,
 * based on the provided component's data and resource bindings. It is intended to be used
 * as a renderer for a boolean field indicating whether a registered declaration exists.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceValues.data - The data object containing field values.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @param {Object} component?.resourceBindings.harTinglystErklaering - Resource bindings for the specific field.
 * @param {string} component?.resourceBindings.harTinglystErklaering.title - The title for the field.
 * @param {string} component?.resourceBindings.harTinglystErklaering.trueText - Text to display when value is true.
 * @param {string} component?.resourceBindings.harTinglystErklaering.falseText - Text to display when value is false.
 * @returns {HTMLElement} The rendered custom boolean text field element wrapped in a container.
 */
export function renderHarTinglystErklaeringElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Avloep | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.harTinglystErklaering?.title,
            trueText: component?.resourceBindings?.harTinglystErklaering?.trueText,
            falseText: component?.resourceBindings?.harTinglystErklaering?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.harTinglystErklaering
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "Skal Installere Vannklosett".
 *
 * This function creates a custom element with specific HTML attributes and resource bindings,
 * based on the provided component's data and resource bindings. It is intended to be used
 * as a renderer for a boolean field indicating whether a water closet will be installed.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceValues.data - The data object containing field values.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @param {Object} component?.resourceBindings.skalInstallereVannklosett - Resource bindings for the specific field.
 * @param {string} component?.resourceBindings.skalInstallereVannklosett.title - The title for the field.
 * @param {string} component?.resourceBindings.skalInstallereVannklosett.trueText - Text to display when value is true.
 * @param {string} component?.resourceBindings.skalInstallereVannklosett.falseText - Text to display when value is false.
 * @returns {HTMLElement} The rendered custom boolean text field element wrapped in a container.
 */
export function renderSkalInstallereVannklosettElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Avloep | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.skalInstallereVannklosett?.title,
            trueText: component?.resourceBindings?.skalInstallereVannklosett?.trueText,
            falseText: component?.resourceBindings?.skalInstallereVannklosett?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.skalInstallereVannklosett
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "Har Utslippstillatelse".
 *
 * This function creates a custom element with specific HTML attributes and resource bindings,
 * based on the provided component's data and resource bindings. It is intended to be used
 * as a renderer for a boolean field indicating whether a discharge permit exists.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceValues.data - The data object containing field values.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @param {Object} component?.resourceBindings.harUtslippstillatelse - Resource bindings for the specific field.
 * @param {string} component?.resourceBindings.harUtslippstillatelse.title - The title for the field.
 * @param {string} component?.resourceBindings.harUtslippstillatelse.trueText - Text to display when value is true.
 * @param {string} component?.resourceBindings.harUtslippstillatelse.falseText - Text to display when value is false.
 * @returns {HTMLElement} The rendered custom boolean text field element wrapped in a container.
 */
export function renderHarUtslippstillatelseElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Avloep | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.harUtslippstillatelse?.title,
            trueText: component?.resourceBindings?.harUtslippstillatelse?.trueText,
            falseText: component?.resourceBindings?.harUtslippstillatelse?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.harUtslippstillatelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
