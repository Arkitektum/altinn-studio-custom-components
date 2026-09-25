// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";
import type { CustomElementProps } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

export default customElements.define(
    "custom-field-count-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const htmlAttributes = new CustomElementHtmlAttributes(component as CustomElementProps);
                    host.innerHTML = "";
                    host.appendChild(createCustomElement("custom-field", htmlAttributes));
                }
            });
        }
    }
);
