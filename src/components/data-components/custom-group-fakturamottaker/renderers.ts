import type Fakturamottaker from "../../../classes/data-classes/Fakturamottaker.ts";
import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

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
 * Renders a custom field element for one text property of the invoice recipient.
 *
 * The six text properties differ only in which value they read and which binding names their title, so they share
 * one renderer rather than repeating the attribute assembly six times.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {string} binding - The key under resourceBindings holding this property's title.
 * @param {*} value - The value to display.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
function renderFieldElement(component: InstantiatedComponent | null | undefined, binding: string, value: unknown) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.[binding]?.title,
            emptyFieldText: component?.resourceBindings?.[binding]?.emptyFieldText
        },
        resourceValues: {
            data: value
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * The invoice recipient the component class assembled, read off the non-empty branch.
 *
 * On the empty branch `resourceValues.data` is the empty-field text instead, and the renderers below are not called.
 *
 * @param {Object} component - The component object containing resource values.
 * @returns {Fakturamottaker|undefined} The invoice recipient, or undefined when the component holds none.
 */
function fakturamottaker(component?: InstantiatedComponent | null) {
    return component?.resourceValues?.data as Fakturamottaker | undefined;
}

/**
 * Renders the name of the invoice recipient.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderNavnElement(component?: InstantiatedComponent | null) {
    return renderFieldElement(component, "navn", fakturamottaker(component)?.navn);
}

/**
 * Renders the address of the invoice recipient.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom address element wrapped in a container.
 */
export function renderAdresseElement(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.adresse?.title
        },
        resourceValues: {
            data: fakturamottaker(component)?.adresse
        }
    });
    return addContainerElement(createCustomElement("custom-field-adresse", htmlAttributes));
}

/**
 * Renders the organization number of the invoice recipient.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderOrganisasjonsnummerElement(component?: InstantiatedComponent | null) {
    return renderFieldElement(component, "organisasjonsnummer", fakturamottaker(component)?.organisasjonsnummer);
}

/**
 * Renders the orderer's reference.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBestillerreferanseElement(component?: InstantiatedComponent | null) {
    return renderFieldElement(component, "bestillerreferanse", fakturamottaker(component)?.bestillerreferanse);
}

/**
 * Renders the invoice reference.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderFakturareferanseElement(component?: InstantiatedComponent | null) {
    return renderFieldElement(component, "fakturareferanse", fakturamottaker(component)?.fakturareferanse);
}

/**
 * Renders the project number.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderProsjektnummerElement(component?: InstantiatedComponent | null) {
    return renderFieldElement(component, "prosjektnummer", fakturamottaker(component)?.prosjektnummer);
}

/**
 * Renders the email address of the invoice recipient.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderEpostElement(component?: InstantiatedComponent | null) {
    return renderFieldElement(component, "epost", fakturamottaker(component)?.epost);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
