// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderFeedbackElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedback",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const value = component?.formData?.simpleBinding;
            if (!value && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFeedbackElement(value, component?.feedbackType, component?.styleOverride);
            }
        }
    }
);
