// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderEmptyFieldText, renderVegtypeTillatelseElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-vegtype-tillatelse",
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
                const vegtypeTillatelseData = component.resourceValues.data;
                if (Array.isArray(vegtypeTillatelseData)) {
                    for (const vegtypeTillatelse of vegtypeTillatelseData) {
                        const vegtypeTillatelseElement = renderVegtypeTillatelseElement(component, vegtypeTillatelse);
                        this.appendChild(vegtypeTillatelseElement);
                    }
                }
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
