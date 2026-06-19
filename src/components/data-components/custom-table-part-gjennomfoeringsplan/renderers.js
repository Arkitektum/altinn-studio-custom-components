// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom table part component for the "Gjennomføringsplan" context, with columns for
 * name, organization number and responsibility class (tiltaksklasse).
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceBindings.navn] - Resource bindings for the "navn" column.
 * @param {string} [component.resourceBindings.navn.title] - Title for the "navn" column.
 * @param {string} [component.resourceBindings.navn.emptyFieldText] - Text to display when the "navn" field is empty.
 * @param {Object} [component.resourceBindings.organisasjonsnummer] - Resource bindings for the "organisasjonsnummer" column.
 * @param {string} [component.resourceBindings.organisasjonsnummer.title] - Title for the "organisasjonsnummer" column.
 * @param {string} [component.resourceBindings.organisasjonsnummer.emptyFieldText] - Text to display when the "organisasjonsnummer" field is empty.
 * @param {Object} [component.resourceBindings.tiltaksklasse] - Resource bindings for the "tiltaksklasse" column.
 * @param {string} [component.resourceBindings.tiltaksklasse.title] - Title for the "tiltaksklasse" column.
 * @param {string} [component.resourceBindings.tiltaksklasse.emptyFieldText] - Text to display when the "tiltaksklasse" field is empty.
 * @param {Object} [component.resourceBindings.part] - Resource bindings for the table part title.
 * @param {string} [component.resourceBindings.part.title] - Title for the table part.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @param {string} [component.size] - Size attribute for the custom table element.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderPartTable(component) {
    const tableColumns = [
        {
            tagName: "custom-field-data",
            dataKey: "navn",
            resourceBindings: {
                title: component?.resourceBindings?.navn?.title,
                emptyFieldText: component?.resourceBindings?.navn?.emptyFieldText
            }
        },
        {
            tagName: "custom-field-data",
            dataKey: "organisasjonsnummer",
            resourceBindings: {
                title: component?.resourceBindings?.organisasjonsnummer?.title,
                emptyFieldText: component?.resourceBindings?.organisasjonsnummer?.emptyFieldText
            }
        },
        {
            tagName: "custom-field-data",
            dataKey: "tiltaksklasse",
            resourceBindings: {
                title: component?.resourceBindings?.tiltaksklasse?.title,
                emptyFieldText: component?.resourceBindings?.tiltaksklasse?.emptyFieldText
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: component?.size,
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
