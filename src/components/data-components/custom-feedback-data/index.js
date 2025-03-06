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
            const { formData, hideIfEmpty, emptyFieldText, styleOverride } = getCustomComponentProps(this);
            const feedbackType = this.getAttribute("feedbackType");
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !formData?.simpleBinding && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const value = hasValue(formData?.simpleBinding) ? formData?.simpleBinding : emptyFieldText;
                this.innerHTML = createCustomElement("custom-feedback", {
                    formData: { simpleBinding: value },
                    feedbackType,
                    styleOverride
                }).outerHTML;
            }
        }
    }
);
