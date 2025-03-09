import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { renderFeedbackElement } from "./functions.js";
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
