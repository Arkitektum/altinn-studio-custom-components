// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";

// Local functions
import {
    renderEierAdresseElement,
    renderEierPartElement,
    renderEmptyFieldText,
    renderNaboGjenboerEiendomElement,
    renderResponsErMerknadEllerSamtykkeMottattElement,
    renderResponsNabovarselSendtElement,
    renderResponsNabovarselSendtViaElement,
    renderResponsSamtykkeEllerMerknadMottattElement
} from "./renderers.js";

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
                        containerElement.appendChild(renderEierPartElement(component));
                        containerElement.appendChild(renderEierAdresseElement(component));
                        containerElement.appendChild(renderResponsNabovarselSendtViaElement(component));
                        containerElement.appendChild(renderResponsNabovarselSendtElement(component));
                        containerElement.appendChild(renderResponsErMerknadEllerSamtykkeMottattElement(component));
                        containerElement.appendChild(renderResponsSamtykkeEllerMerknadMottattElement(component));
                        host.appendChild(containerElement);

                        const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                        if (feedbackListElement) {
                            host.appendChild(feedbackListElement);
                        }
                    }
                }
            });
        }
    }
);
