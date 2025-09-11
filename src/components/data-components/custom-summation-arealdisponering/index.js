// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderSummationArealdisponering } from "./renderers.js";

export default customElements.define(
    "custom-summation-arealdisponering",
    class extends HTMLElement {
        connectedCallback() {
            const component = new instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                const summationArealdisponeringElement = renderSummationArealdisponering(component);
                this.appendChild(summationArealdisponeringElement);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
