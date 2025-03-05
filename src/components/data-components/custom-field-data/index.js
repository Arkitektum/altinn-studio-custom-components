import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";

export default customElements.define(
    "custom-field-data",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleOverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);

            if (hideIfEmpty && !formData?.simpleBinding && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const value = hasValue(formData?.simpleBinding) ? formData?.simpleBinding : emptyFieldText;
                this.innerHTML = createCustomElement("custom-field", {
                    formData: { simpleBinding: value },
                    text: title,
                    hideTitle,
                    hideIfEmpty,
                    emptyFieldText,
                    inline,
                    styleOverride
                }).outerHTML;
            }
        }
    }
);
