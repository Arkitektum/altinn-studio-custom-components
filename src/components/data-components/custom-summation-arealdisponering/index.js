// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderSummationArealdisponering } from "./renderers.js";

export default customElements.define(
    "custom-summation-arealdisponering",
    class extends HTMLElement {
        connectedCallback() {
            const component = new instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else {
                const summationArealdisponeringElement = renderSummationArealdisponering(component);
                if (component?.resourceValues?.title && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                this.appendChild(summationArealdisponeringElement);
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
