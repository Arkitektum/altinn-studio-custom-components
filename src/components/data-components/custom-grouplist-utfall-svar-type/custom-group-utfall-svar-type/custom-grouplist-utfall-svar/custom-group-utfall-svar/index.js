// Global functions
import { getComponentContainerElement } from "../../../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../../../functions/feedbackHelpers.js";

// Local functions
import {
    renderBeskrivelseElement,
    renderHeaderElement,
    renderKommentarElement,
    renderStatusElement,
    renderTemaElement,
    renderVedleggslisteElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-utfall-svar",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const containerElement = document.createElement("div");
                containerElement.appendChild(renderHeaderElement(component, "h3"));
                containerElement.appendChild(renderBeskrivelseElement(component));
                containerElement.appendChild(renderStatusElement(component));
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
