import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";

export default customElements.define(
    "custom-feedback-data",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, styleOverride } = getCustomComponentProps(this);
            const feedbackType = this.getAttribute("feedbackType");
            const componentContainerElement = getComponentContainerElement(this);
            const value = formData?.simpleBinding;
            if (!hasValue(value) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = createCustomElement("custom-feedback", {
                    formData: { simpleBinding: value },
                    feedbackType,
                    styleOverride
                }).outerHTML;
            }
        }
    }
);
