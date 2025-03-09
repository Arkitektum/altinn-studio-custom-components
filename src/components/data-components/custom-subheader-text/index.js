import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement } from "../../../functions/helpers.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-subheader-text",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const htmlAttributes = new CustomElementHtmlAttributes(component);
            this.innerHTML = createCustomElement("custom-paragraph", htmlAttributes).outerHTML;
        }
    }
);
