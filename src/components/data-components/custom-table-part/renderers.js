// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table part component with specified columns and attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceBindings.navn] - Resource bindings for the "navn" column.
 * @param {string} [component.resourceBindings.navn.title] - Title for the "navn" column.
 * @param {string} [component.resourceBindings.navn.emptyFieldText] - Text to display when the "navn" field is empty.
 * @param {Object} [component.resourceBindings.telefonnummer] - Resource bindings for the "telefonnummer" column.
 * @param {string} [component.resourceBindings.telefonnummer.title] - Title for the "telefonnummer" column.
 * @param {string} [component.resourceBindings.telefonnummer.emptyFieldText] - Text to display when the "telefonnummer" field is empty.
 * @param {Object} [component.resourceBindings.epost] - Resource bindings for the "epost" column.
 * @param {string} [component.resourceBindings.epost.title] - Title for the "epost" column.
 * @param {string} [component.resourceBindings.epost.emptyFieldText] - Text to display when the "epost" field is empty.
 * @param {Object} [component.resourceBindings.part] - Resource bindings for the table part title.
 * @param {string} [component.resourceBindings.part.title] - Title for the table part.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderPartTable(component) {
    const tableColumns = [
        {
            tagName: "custom-field-part-navn",
            resourceBindings: {
                title: component?.resourceBindings?.navn?.title,
                emptyFieldText: component?.resourceBindings?.navn?.emptyFieldText
            }
        },
        {
            tagName: "custom-field-telefonnummer",
            resourceBindings: {
                title: component?.resourceBindings?.telefonnummer?.title,
                emptyFieldText: component?.resourceBindings?.telefonnummer?.emptyFieldText
            }
        },
        {
            tagName: "custom-field-data",
            dataKey: "epost",
            resourceBindings: {
                title: component?.resourceBindings?.epost?.title,
                emptyFieldText: component?.resourceBindings?.epost?.emptyFieldText
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.part?.title
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
