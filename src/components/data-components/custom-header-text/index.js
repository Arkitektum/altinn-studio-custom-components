import {
    addStyle,
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps
} from "../../../functions/helpers.js";

export default customElements.define(
    "custom-header-text",
    class extends HTMLElement {
        connectedCallback() {
            const { text, styleOverride, size, isChildComponent } = getCustomComponentProps(this);
            if (!isChildComponent) {
                const containerElement = getComponentContainerElement(this);
                addStyle(containerElement, {
                    padding: "0 0.75rem"
                });
            }
            this.innerHTML = createCustomElement("custom-header", {
                text,
                size,
                styleOverride
            }).outerHTML;
        }
    }
);
