// Global functions
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";

// Local functions
import { renderUtfallSvarGroupList } from "./renderers.js";

export default customElements.define(
    "custom-group-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            if (!component.isEmpty) {
                const utfallSvarGroupListElement = renderUtfallSvarGroupList(component);
                this.appendChild(utfallSvarGroupListElement);

                const feebackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                if (feebackListElement) {
                    this.appendChild(feebackListElement);
                }
            }
        }
    }
);
