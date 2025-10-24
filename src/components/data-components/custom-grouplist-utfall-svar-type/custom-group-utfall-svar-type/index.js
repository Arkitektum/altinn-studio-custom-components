// Global functions
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../../functions/helpers.js";
import { renderEmptyFieldText } from "../../custom-grouplist-sjekklistekrav/custom-group-sjekklistekrav/renderers.js";

// Local functions
import { renderUtfallSvarGroupList } from "./renderers.js";

export default customElements.define(
    "custom-group-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else {
                const utfallSvarGroupListElement = renderUtfallSvarGroupList(component);
                this.appendChild(utfallSvarGroupListElement);

                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
