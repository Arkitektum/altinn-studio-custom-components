// Classes
import ValidationMessages from "../../../classes/system-classes/ValidationMessages.js";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderValidationMessagesElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-validation-messages",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
                    const validationMessages = new ValidationMessages(component?.resourceValues?.data);
                    host.innerHTML = renderValidationMessagesElement(validationMessages);
                }
            });
        }
    }
);
