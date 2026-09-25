// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";
import type { CustomElementProps } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const htmlAttributes = new CustomElementHtmlAttributes(component as CustomElementProps);
                    const tagName = component!.isEmpty ? "custom-field" : "custom-list";
                    host.innerHTML = "";
                    host.appendChild(createCustomElement(tagName, htmlAttributes));
                }
            });
        }
    }
);
