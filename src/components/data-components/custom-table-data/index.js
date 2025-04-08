import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, getComponentTexts } from "../../../functions/helpers.js";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";
import { renderTableElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-data",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && !component?.formData?.data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const texts = await getComponentTexts(this);
                component.setTexts(texts);
                const validationMessages = validateTableHeadersTextResourceBindings(
                    component?.tableColumns,
                    component?.texts
                );
                const hasMessages = hasValidationMessages(validationMessages);
                const feebackListElement = hasMessages && renderFeedbackListElement(validationMessages);
                const tableElement = renderTableElement(component);
                this.appendChild(tableElement);
                if (feebackListElement) {
                    this.appendChild(feebackListElement);
                }
            }
        }
    }
);
