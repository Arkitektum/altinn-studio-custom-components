// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import ValidationMessages from "../../../classes/system-classes/ValidationMessages.js";

// Global functions
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import { renderValidationMessagesElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-validation-messages",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const validationMessages = new ValidationMessages(component?.formData?.data);
            if (!hasValue(validationMessages) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderValidationMessagesElement(validationMessages);
            }
        }
    }
);
