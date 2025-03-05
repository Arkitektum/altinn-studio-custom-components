import { createCustomElement } from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";

export function renderTableElement(tableColumns, formData, texts, title, size, emptyFieldText, styleOverride) {
    return createCustomElement("custom-table", {
        formData: {
            data: {
                tableHeaders: getTableHeaders(tableColumns, texts),
                tableRows: getTableRows(tableColumns, formData?.data)
            }
        },
        text: title,
        size,
        emptyFieldText,
        styleOverride
    });
}

export function renderFeedbackListElement(validationMessages) {
    const feedbackListElement = createCustomElement("custom-feedbacklist-validation-messages", {
        formData: { data: validationMessages }
    });
    return feedbackListElement;
}
