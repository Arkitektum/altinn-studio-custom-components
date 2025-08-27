// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table element for displaying "arbeidsplasser" (workplaces) data.
 *
 * @param {Object} component - The component configuration object containing resource bindings and values.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceBindings.arbeidsplasserKey] - Resource binding for the "title" column.
 * @param {Object} [component.resourceBindings.beroertAvTiltaket] - Resource binding for the "value" column.
 * @param {Object} [component.resourceBindings.arbeidsplasser] - Resource binding for the table title.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderArbeidsplasserTable(component) {
    const tableColumns = [
        {
            tagName: "custom-field-data",
            dataKey: "title",
            resourceBindings: {
                title: component?.resourceBindings?.arbeidsplasserKey?.title
            }
        },
        {
            tagName: "custom-field-data",
            dataKey: "value",
            resourceBindings: {
                title: component?.resourceBindings?.beroertAvTiltaket?.title
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.arbeidsplasser?.title
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
