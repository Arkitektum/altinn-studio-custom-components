// Global functions
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../../functions/helpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderKommentarElement, renderTemaElement, renderVedleggslisteElement } from "./renderers.js";

export default customElements.define(
    "custom-group-ettersending",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else {
                const containerElement = document.createElement("div");
                containerElement.appendChild(renderHeaderElement(component, "h3"));
                containerElement.appendChild(renderTemaElement(component));
                containerElement.appendChild(renderKommentarElement(component));
                containerElement.appendChild(renderVedleggslisteElement(component));
                this.appendChild(containerElement);

                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
