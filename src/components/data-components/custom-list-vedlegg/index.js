// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

export default customElements.define(
    "custom-list-vedlegg",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const htmlAttributes = new CustomElementHtmlAttributes(component);
                    host.innerHTML = "";
                    host.appendChild(createCustomElement(component?.isEmpty ? "custom-field" : "custom-list", htmlAttributes));
                }
            });
        }
    }
);
