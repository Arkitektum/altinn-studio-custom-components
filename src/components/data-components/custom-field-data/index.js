import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps
} from "../../../functions/helpers.js";

export default customElements.define(
    "custom-field-data",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const value = data || emptyFieldText;
                this.innerHTML = createCustomElement("custom-field", {
                    data: value,
                    text: title,
                    hideTitle,
                    hideIfEmpty,
                    emptyFieldText,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
