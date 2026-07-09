// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { addDevToolsOverlay } from "../../../functions/devToolsHelpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

export default customElements.define(
    "custom-paragraph-text",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const htmlAttributes = new CustomElementHtmlAttributes(component);
            this.innerHTML = "";
            this.appendChild(createCustomElement("custom-paragraph", htmlAttributes));
            addDevToolsOverlay(this, component, "data");
        }
    }
);
