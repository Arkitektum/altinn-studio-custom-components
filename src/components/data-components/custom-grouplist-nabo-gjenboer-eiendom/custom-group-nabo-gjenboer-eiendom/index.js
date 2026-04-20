// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
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
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "data");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
                addDevToolsOverlay(this, component, "data");
            } else {
                const containerElement = document.createElement("div");
                containerElement.appendChild(renderNaboGjenboerEiendomElement(component));
                containerElement.appendChild(renderEierPartElement(component));
                containerElement.appendChild(renderEierAdresseElement(component));
                containerElement.appendChild(renderResponsNabovarselSendtViaElement(component));
                containerElement.appendChild(renderResponsNabovarselSendtElement(component));
                containerElement.appendChild(renderResponsErMerknadEllerSamtykkeMottattElement(component));
                containerElement.appendChild(renderResponsSamtykkeEllerMerknadMottattElement(component));
                this.appendChild(containerElement);

                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
                addDevToolsOverlay(this, component, "data");
            }
        }
    }
);
