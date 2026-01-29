// Global functions
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderEmptyFieldText, renderSamsvarAnsvarsomraadeGroup } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-samsvar-ansvarsomraade",
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
                const data = component?.resourceValues?.data ?? [];

                data.sort((a, b) => {
                    const aCode = a?.funksjon?.kodeverdi;
                    const bCode = b?.funksjon?.kodeverdi;

                    if (aCode === "pro" && bCode !== "pro") return -1;
                    if (aCode !== "pro" && bCode === "pro") return 1;
                    return 0;
                });
                for (const samsvarAnsvarsomraade of data) {
                    const samsvarAnsvarsomraadeElement = renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, component);
                    this.appendChild(samsvarAnsvarsomraadeElement);
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
