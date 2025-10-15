// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom plan table component with specified columns and attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table fields and title.
 * @param {Object} [component.resourceBindings.navn] - Resource bindings for the "navn" column.
 * @param {string} [component.resourceBindings.navn.title] - Title for the "navn" column.
 * @param {string} [component.resourceBindings.navn.emptyFieldText] - Text to display when "navn" field is empty.
 * @param {Object} [component.resourceBindings.plantype] - Resource bindings for the "plantype" column.
 * @param {string} [component.resourceBindings.plantype.title] - Title for the "plantype" column.
 * @param {string} [component.resourceBindings.plantype.emptyFieldText] - Text to display when "plantype" field is empty.
 * @param {Object} [component.resourceBindings.plan] - Resource bindings for the table title.
 * @param {string} [component.resourceBindings.plan.title] - Title for the table.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @param {string} [component.size] - Size attribute for the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderPlanTable(component) {
    const tableColumns = [
        {
            dataKey: "navn",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.navn?.title,
                emptyFieldText: component?.resourceBindings?.navn?.emptyFieldText
            }
        },
        {
            dataKey: "plantype.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.plantype?.title,
                emptyFieldText: component?.resourceBindings?.plantype?.emptyFieldText
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: component?.size,
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.plan?.title
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
