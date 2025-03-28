import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement } from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";

/**
 * Renders a custom table element by setting form data and creating a custom HTML element.
 *
 * @param {Object} component - The component object containing configuration and data.
 * @param {Array} component.tableColumns - The columns configuration for the table.
 * @param {Object} component.texts - The text resources used for table headers.
 * @param {Object} component.formData - The form data containing table rows data.
 * @param {Object} component.formData.data - The data used to populate table rows.
 *
 * @returns {HTMLElement} The created custom table element.
 */
export function renderTableElement(component) {
    component.setFormData({
        data: {
            tableHeaders: getTableHeaders(component?.tableColumns, component?.texts),
            tableRows: getTableRows(component?.tableColumns, component?.formData?.data)
        }
    });
    const htmlAttributes = new CustomElementHtmlAttributes(component);
    return createCustomElement("custom-table", htmlAttributes);
}
