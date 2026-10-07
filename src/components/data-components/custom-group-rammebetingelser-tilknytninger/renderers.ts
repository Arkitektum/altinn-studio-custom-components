import type { InstantiatedComponent } from "../../../types.ts";
import type RammebetingelserTilknytninger from "../../../classes/data-classes/RammebetingelserTilknytninger.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

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
 * Renders a custom "adkomst" element for a given component.
 *
 * This function extracts relevant resource bindings and values from the provided component,
 * constructs the necessary HTML attributes, and returns the custom element.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component?.resourceValues] - The resource values associated with the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing adkomst information.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component?.resourceBindings.adkomst] - The adkomst resource binding.
 * @param {string} [component?.resourceBindings.adkomst.title] - The title for the adkomst element.
 * @param {string} [component?.resourceBindings.adkomstErNyEllerEndretAdkomst] - Indicates if the adkomst is new or changed.
 * @param {string} [component?.resourceBindings.adkomstVegtype] - The type of road (vegtype) for the adkomst.
 * @param {string} [component?.resourceBindings.adkomstErTillatelseGitt] - Indicates if the adkomst has been granted permission.
 * @returns {HTMLElement} The rendered custom "adkomst" element.
 */
export function renderAdkomstElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as RammebetingelserTilknytninger | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.adkomst?.title,
            erNyEllerEndretAdkomst: component?.resourceBindings?.adkomstErNyEllerEndretAdkomst,
            vegtype: component?.resourceBindings?.adkomstVegtype,
            erTillatelseGitt: component?.resourceBindings?.adkomstErTillatelseGitt
        },
        resourceValues: {
            data: data?.adkomst
        }
    });
    return createCustomElement("custom-group-adkomst", htmlAttributes);
}

/**
 * Renders a custom group element for "avløp" (sewage) with specific HTML attributes.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - The resource values for the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing avløp information.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component?.resourceBindings.avloep] - The resource binding for avløp.
 * @param {string} [component?.resourceBindings.avloep.title] - The title for the avløp element.
 * @param {string} [component?.resourceBindings.avloepHarTinglystErklaering] - Binding for "har tinglyst erklæring".
 * @param {string} [component?.resourceBindings.avloepKrysserAvloepAnnensGrunn] - Binding for "krysser avløp annens grunn".
 * @param {string} [component?.resourceBindings.avloepTilknytningstype] - Binding for "tilknytningstype".
 * @returns {HTMLElement} The rendered custom group avløp element.
 */
export function renderAvloepElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as RammebetingelserTilknytninger | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.avloep?.title,
            harTinglystErklaering: component?.resourceBindings?.avloepHarTinglystErklaering,
            krysserAvloepAnnensGrunn: component?.resourceBindings?.avloepKrysserAvloepAnnensGrunn,
            tilknytningstype: component?.resourceBindings?.avloepTilknytningstype,
            skalInstallereVannklosett: component?.resourceBindings?.avloepSkalInstallereVannklosett,
            harUtslippstillatelse: component?.resourceBindings?.avloepHarUtslippstillatelse
        },
        resourceValues: {
            data: data?.avloep
        }
    });
    return createCustomElement("custom-group-avloep", htmlAttributes);
}

/**
 * Renders a custom "overvann" (stormwater) element using the provided component's resource values and bindings.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - The resource values associated with the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing "overvann" information.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component?.resourceBindings.overvann] - The resource binding for "overvann" with a title.
 * @param {string} [component?.resourceBindings.overvann.title] - The title for the "overvann" section.
 * @param {string} [component?.resourceBindings.overvannLedesOvervannTilAvloepssystem] - Binding for "ledesOvervannTilAvloepssystem".
 * @param {string} [component?.resourceBindings.overvannLedesOvervannTilTerreng] - Binding for "ledesOvervannTilTerreng".
 * @returns {HTMLElement} The rendered custom "overvann" element.
 */
export function renderOvervannElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as RammebetingelserTilknytninger | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.overvann?.title,
            ledesOvervannTilAvloepssystem: component?.resourceBindings?.overvannLedesOvervannTilAvloepssystem,
            ledesOvervannTilTerreng: component?.resourceBindings?.overvannLedesOvervannTilTerreng
        },
        resourceValues: {
            data: data?.overvann
        }
    });
    return createCustomElement("custom-group-overvann", htmlAttributes);
}

/**
 * Renders a custom vannforsyning (water supply) element using the provided component's resource bindings and values.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component?.resourceValues] - The resource values associated with the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing vannforsyning information.
 * @param {Object} [component?.resourceBindings] - The resource bindings for vannforsyning fields.
 * @param {Object} [component?.resourceBindings.vannforsyning] - The vannforsyning resource binding.
 * @param {string} [component?.resourceBindings.vannforsyning.title] - The title for vannforsyning.
 * @param {string} [component?.resourceBindings.vannforsyningBeskrivelse] - The description for vannforsyning.
 * @param {string} [component?.resourceBindings.vannforsyningHarTinglystErklaering] - Indicates if there is a registered declaration.
 * @param {string} [component?.resourceBindings.vannforsyningKrysserVannforsyningAnnensGrunn] - Indicates if the water supply crosses another's property.
 * @param {string} [component?.resourceBindings.vannforsyningTilknytningstype] - The type of connection for vannforsyning.
 * @returns {HTMLElement} The rendered vannforsyning custom element.
 */
export function renderVannforsyningElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as RammebetingelserTilknytninger | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.vannforsyning?.title,
            beskrivelse: component?.resourceBindings?.vannforsyningBeskrivelse,
            harTinglystErklaering: component?.resourceBindings?.vannforsyningHarTinglystErklaering,
            krysserVannforsyningAnnensGrunn: component?.resourceBindings?.vannforsyningKrysserVannforsyningAnnensGrunn,
            tilknytningstype: component?.resourceBindings?.vannforsyningTilknytningstype
        },
        resourceValues: {
            data: data?.vannforsyning
        }
    });
    return createCustomElement("custom-group-vannforsyning", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
