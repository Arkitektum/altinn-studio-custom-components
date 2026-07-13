// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

export default customElements.define(
    "custom-description-list-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const htmlAttributes = new CustomElementHtmlAttributes(component);
                    const tagName = component.isEmpty ? "custom-field" : "custom-description-list";
                    host.innerHTML = "";
                    host.appendChild(createCustomElement(tagName, htmlAttributes));
                }
            });
        }
    }
);
