import { getComponentContainerElement, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderFeedbackElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedback",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, hideIfEmpty, styleOverride } = getCustomComponentProps(this);
            const feedbackType = this.getAttribute("feedbackType");
            const componentContainerElement = getComponentContainerElement(this);
            const value = formData?.simpleBinding;
            if (hideIfEmpty && !value && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFeedbackElement(value, feedbackType, styleOverride);
            }
        }
    }
);
