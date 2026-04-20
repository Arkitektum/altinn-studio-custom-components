// Dependencies
import { createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentContainerElement } from "../../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../../functions/feedbackHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderUtfallSvarGroup } from "./renderers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../../../functions/devToolsHelpers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
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
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                for (const utfallSvar of component?.resourceValues?.data ?? []) {
                    const utfallSvarElement = renderUtfallSvarGroup(utfallSvar, component);
                    this.appendChild(utfallSvarElement);
                    const dividerElement = createCustomElement("custom-divider");
                    this.appendChild(dividerElement);
                }
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
