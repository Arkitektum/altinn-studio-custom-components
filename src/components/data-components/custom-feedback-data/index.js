import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps
} from "../../../functions/helpers.js";

export default customElements.define(
    "custom-feedback-data",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, styleOverride } =
                getCustomComponentProps(this);
            const feedbackType = this.getAttribute("feedbackType");
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !formData?.simpleBinding && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const value = formData?.simpleBinding || emptyFieldText;
                this.innerHTML = createCustomElement("custom-feedback", {
                    formData: { simpleBinding: value },
                    text: title,
                    hideTitle,
                    hideIfEmpty,
                    feedbackType,
                    emptyFieldText,
                    styleOverride
                }).outerHTML;
            }
        }
    }
);
