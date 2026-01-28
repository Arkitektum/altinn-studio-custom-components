// Global functions
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderNaboGjenboerEiendomGroup, renderEmptyFieldText, renderHeaderElement, renderDivider } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-nabo-gjenboer-eiendom",
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
                for (const naboGjenboerEiendom of component?.resourceValues?.data ?? []) {
                    const naboGjenboerEiendomElement = renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component);
                    this.appendChild(naboGjenboerEiendomElement);
                    const dividerElement = renderDivider();
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
