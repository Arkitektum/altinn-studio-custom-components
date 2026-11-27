// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.ts";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.ts";

// Local functions
import {
    renderEierNavnElement,
    renderEmptyFieldText,
    renderNaboGjenboerEiendomElement,
    renderResponsErMerknadEllerSamtykkeMottattElement,
    renderResponsNabovarselSendtElement
} from "./renderers.ts";

export default customElements.define(
    "custom-group-nabo-gjenboer-eiendom",
    class extends HTMLElement {
        connectedCallback() {
            // Feedback is appended only in the non-empty branch (matching the original), so it is handled inside
            // render rather than via the helper's withFeedback option.
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        const containerElement = document.createElement("div");
                        containerElement.appendChild(renderNaboGjenboerEiendomElement(component));
                        containerElement.appendChild(renderEierNavnElement(component));
                        containerElement.appendChild(renderResponsNabovarselSendtElement(component));
                        containerElement.appendChild(renderResponsErMerknadEllerSamtykkeMottattElement(component));
                        host.appendChild(containerElement);

                        const feedbackListElement = component!.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                        if (feedbackListElement) {
                            host.appendChild(feedbackListElement as Node);
                        }
                    }
                }
            });
        }
    }
);
