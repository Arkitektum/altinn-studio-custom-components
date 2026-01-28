// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderErLoefteinnretningIBygningElement,
    renderHeaderElement,
    renderPlanlagteLoefteinnretningerElement,
    renderPlanleggesLoefteinnretningIBygningElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-loefteinnretninger",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                if (component?.isEmpty) {
                    const emptyFieldTextElement = renderEmptyFieldText(component);
                    this.appendChild(emptyFieldTextElement);
                } else {
                    this.appendChild(renderErLoefteinnretningIBygningElement(component));
                    this.appendChild(renderPlanleggesLoefteinnretningIBygningElement(component));
                    this.appendChild(renderPlanlagteLoefteinnretningerElement(component));
                }
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
