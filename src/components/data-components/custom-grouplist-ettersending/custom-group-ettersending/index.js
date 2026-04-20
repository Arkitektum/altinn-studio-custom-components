// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentContainerElement } from "../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderKommentarElement, renderTemaElement, renderVedleggslisteElement } from "./renderers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../../functions/devToolsHelpers.js";

export default customElements.define(
    "custom-group-ettersending",
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
                if (hasValue(component?.resourceValues?.data?.tittel) && component?.hideTitle !== true) {
                    containerElement.appendChild(renderHeaderElement(component?.resourceValues?.data?.tittel, component?.size));
                }
                containerElement.appendChild(renderTemaElement(component));
                containerElement.appendChild(renderKommentarElement(component));
                containerElement.appendChild(renderVedleggslisteElement(component));
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
