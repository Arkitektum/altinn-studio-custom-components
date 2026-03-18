// Dependencies
import { createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";

export default customElements.define(
    "custom-paragraph-text",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const htmlAttributes = new CustomElementHtmlAttributes(component);
            this.innerHTML = createCustomElement("custom-paragraph", htmlAttributes).outerHTML;
        }
    }
);
