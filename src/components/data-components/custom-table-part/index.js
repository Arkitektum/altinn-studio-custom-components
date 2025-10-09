// Global functions
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderPartTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-part",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                const partTable = renderPartTable(component);
                this.appendChild(partTable);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
