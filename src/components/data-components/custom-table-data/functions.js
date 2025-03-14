import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement } from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";

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

export function renderFeedbackListElement(validationMessages) {
    const htmlAttributes = new CustomElementHtmlAttributes({ formData: { data: validationMessages } });
    const feedbackListElement = createCustomElement("custom-feedbacklist-validation-messages", htmlAttributes);
    return feedbackListElement;
}
