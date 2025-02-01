import { createCustomElement, getCustomComponentProps } from "../../../functions/helpers.js";

export default customElements.define(
    "custom-header-text",
    class extends HTMLElement {
        connectedCallback() {
            const { text, styleoverride, size } = getCustomComponentProps(this);
            this.innerHTML = createCustomElement("custom-header", {
                text,
                size,
                styleoverride
            }).outerHTML;
        }
    }
);
