// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

export default customElements.define(
    "custom-paragraph-text",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const htmlAttributes = new CustomElementHtmlAttributes(component);
                    host.innerHTML = "";
                    host.appendChild(createCustomElement("custom-paragraph", htmlAttributes));
                }
            });
        }
    }
);
