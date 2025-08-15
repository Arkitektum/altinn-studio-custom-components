// Global functions
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";
import { renderDispensasjonerUnitInListElement } from "./renderers.js";

export default customElements.define(
    "custom-dispensasjoner-unit-in-list",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            console.log("component fra unit in list:", component);
            if (!component.isEmpty) {
                const feebackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                const unitInListElement = renderDispensasjonerUnitInListElement(component);
                this.appendChild(unitInListElement);
                if (feebackListElement) {
                    this.appendChild(feebackListElement);
                }
            }
        }
    }
);
