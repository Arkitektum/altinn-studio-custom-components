import {
    createCustomElement,
    getCustomComponentProps
} from "../../../functions/helpers.js";

export default customElements.define(
    "custom-paragraph-text",
    class extends HTMLElement {
        connectedCallback() {
            const { text, styleOverride } = getCustomComponentProps(this);
            this.innerHTML = createCustomElement("custom-paragraph", {
                text,
                styleOverride
            }).outerHTML;
        }
    }
);
