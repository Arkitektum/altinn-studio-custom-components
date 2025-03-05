import {
    getComponentContainerElement,
    getComponentTexts,
    getCustomComponentProps
} from "../../../functions/helpers.js";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";
import { renderFeedbackListElement, renderTableElement } from "./functions.js";

export default customElements.define(
    "custom-table-data",
    class extends HTMLElement {
        async connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, size, styleOverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !formData?.data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const texts = await getComponentTexts(this);
                const tableColumns = JSON.parse(this.getAttribute("tableColumns"));
                const title = !hideTitle && text;
                const validationMessages = validateTableHeadersTextResourceBindings(tableColumns, texts);
                const hasMessages = hasValidationMessages(validationMessages);
                const feebackListElement = hasMessages && renderFeedbackListElement(validationMessages);
                const tableElement = renderTableElement(
                    tableColumns,
                    formData,
                    texts,
                    title,
                    size,
                    emptyFieldText,
                    styleOverride
                );
                this.appendChild(tableElement);
                if (feebackListElement) {
                    this.appendChild(feebackListElement);
                }
            }
        }
    }
);
