// Global functions
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../../functions/helpers.js";

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
                if (hasValue(component?.resourceValues?.data?.tittel) && component?.hideTitle !== true) {
                    containerElement.appendChild(renderHeaderElement(component?.resourceValues?.data?.tittel, component?.size));
                }
                containerElement.appendChild(renderTemaElement(component));
                containerElement.appendChild(renderKommentarElement(component));
                containerElement.appendChild(renderVedleggslisteElement(component));
                this.appendChild(containerElement);
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
