import {
    createCustomElement,
    getCustomComponentProps
} from "../../../functions/helpers.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-subheader-text",
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
