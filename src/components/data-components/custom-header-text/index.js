import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { addStyle, createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";

export default customElements.define(
    "custom-header-text",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            if (!component?.isChildComponent) {
                const containerElement = getComponentContainerElement(this);
                addStyle(containerElement, {
                    padding: "0 0.75rem"
                });
            }
            const htmlAttributes = new CustomElementHtmlAttributes(component);
            this.innerHTML = createCustomElement("custom-header", htmlAttributes).outerHTML;
        }
    }
);
