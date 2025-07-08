// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table part component with predefined columns for part name, phone number, and email.
 *
 * @param {Object} component - The component configuration object.
 * @param {string} [component.partType] - The type of part, used for resource key generation.
 * @param {Object} [component.formData] - The form data to be passed to the table.
 * @param {Object} [component.texts] - The text resources to be used for column titles and empty field text.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderPartTable(component) {
    const tableColumns = [
        {
            tagName: "custom-field-part-navn",
            resourceBindings: {
                title: `resource.${component?.partType}.navn.title`,
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            tagName: "custom-field-telefonnummer",
            resourceBindings: {
                title: `resource.${component?.partType}.telefonnummer.title`,
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            tagName: "custom-field-data",
            dataKey: "epost",
            resourceBindings: {
                title: `resource.${component?.partType}.epost.title`,
                emptyFieldText: "resource.emptyFieldText.default"
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
