// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderPlanlagteLoefteinnretningerList } from "./renderers.js";

export default customElements.define(
    "custom-list-planlagte-loefteinnretninger",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            } else {
                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                const planlagteLoefteinnretningerListElement = renderPlanlagteLoefteinnretningerList(component);
                this.appendChild(planlagteLoefteinnretningerListElement);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
