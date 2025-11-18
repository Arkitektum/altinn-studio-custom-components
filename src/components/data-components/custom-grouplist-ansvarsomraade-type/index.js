// Global functions
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderAnsvarsomraadeType, renderEmptyFieldText, renderHeaderElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-ansvarsomraade-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else if (component?.resourceValues?.data) {
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                for (const ansvarsomraadeTypeKey of Object.keys(component?.resourceValues?.data)) {
                    const ansvarsomraadeTypeElement = renderAnsvarsomraadeType(component, ansvarsomraadeTypeKey);
                    this.appendChild(ansvarsomraadeTypeElement);
                }
                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
