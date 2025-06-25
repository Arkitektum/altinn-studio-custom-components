// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderEiendomTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-eiendom",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const feebackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                const eiendomTableElement = renderEiendomTable(component);
                this.appendChild(eiendomTableElement);
                if (feebackListElement) {
                    this.appendChild(feebackListElement);
                }
            }
        }
    }
);
