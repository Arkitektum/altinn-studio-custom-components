// Global functions
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../../functions/feedbackHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderUtfallSvarGroup } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
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
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
