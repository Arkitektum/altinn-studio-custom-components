// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const htmlAttributes = new CustomElementHtmlAttributes(component);
                    host.innerHTML = "";
                    host.appendChild(createCustomElement("custom-field", htmlAttributes));
                }
            });
        }
    }
);
