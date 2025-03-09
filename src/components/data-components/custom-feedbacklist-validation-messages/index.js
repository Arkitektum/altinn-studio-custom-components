import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import ValidationMessages from "../../../classes/system-classes/ValidationMessages.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { renderValidationMessagesElement } from "./functions.js";
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
