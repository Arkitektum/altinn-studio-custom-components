// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import {
    renderAnsvarsrettErklaertElement,
    renderArbeidetAvsluttetElement,
    renderBeskrivelseElement,
    renderEmptyFieldText,
    renderFunksjonElement,
    renderFunnetAvvikElement,
    renderHeaderElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-kontroll-ansvarsomraade",
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

                containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.ansvarsomraade?.title, component?.size));

                containerElement.appendChild(renderFunksjonElement(component));
                containerElement.appendChild(renderBeskrivelseElement(component));
                containerElement.appendChild(renderAnsvarsrettErklaertElement(component));
                containerElement.appendChild(renderArbeidetAvsluttetElement(component));

                containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.sluttrapport?.title, component?.size));
                containerElement.appendChild(renderFunnetAvvikElement(component));

                this.appendChild(containerElement);
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
