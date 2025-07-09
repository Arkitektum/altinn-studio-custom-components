// Classes
import ValidationMessages from "../../../classes/system-classes/ValidationMessages.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderValidationMessagesElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-validation-messages",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const validationMessages = new ValidationMessages(component?.resourceValues?.data);
            if (component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderValidationMessagesElement(validationMessages);
            }
        }
    }
);
