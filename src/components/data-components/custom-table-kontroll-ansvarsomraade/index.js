// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderKontrollAnsvarsomraadeTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-kontroll-ansvarsomraade",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const kontrollAnsvarsomraadeTableElement = renderKontrollAnsvarsomraadeTable(component);
                this.appendChild(kontrollAnsvarsomraadeTableElement);
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
