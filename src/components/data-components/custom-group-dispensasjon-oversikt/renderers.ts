import type DispensasjonOversikt from "../../../classes/data-classes/DispensasjonOversikt.ts";
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
 * Renders a custom element displaying the count of dispensasjon data for a given component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - Resource values for the component.
 * @param {Object} [component?.resourceBindings] - Resource bindings for the component.
 * @returns {HTMLElement} The custom element with the specified attributes.
 */
export function renderDispensasjonCount(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as DispensasjonOversikt | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.count?.title,
            emptyFieldText: component?.resourceBindings?.count?.emptyFieldText
        },
        resourceValues: {
            data: data?.dispensasjon
        }
    });
    return addContainerElement(createCustomElement("custom-field-count-data", htmlAttributes));
}

/**
 * Renders a custom table element displaying dispensasjon data for a given component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component?.resourceValues] - Resource values for the component.
 * @param {Object} [component?.resourceBindings] - Resource bindings for the component.
 * @returns {HTMLElement} The custom table element with the specified attributes.
 */
export function renderDispensasjonTable(component?: InstantiatedComponent | null) {
    const tableColumns = [
        {
            dataKey: "dispensasjonKategori.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.dispensasjon?.dispensasjonKategori,
                emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
            }
        },
        {
            dataKey: "dispensasjonTittel.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.dispensasjon?.dispensasjonTittel,
                emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
            }
        },
        {
            dataKey: "bestemmelserType.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.dispensasjon?.bestemmelserType,
                emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
            }
        }
    ];
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as DispensasjonOversikt | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        showRowNumbers: true,
        resourceBindings: {
            rowNumberTitle: component?.resourceBindings?.dispensasjon?.rowNumberTitle
        },
        resourceValues: { data: data?.dispensasjon },
        tableColumns
    });
    return createCustomElement("custom-table-data", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
