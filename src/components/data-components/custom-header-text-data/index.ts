// Dependencies
import { CustomElementHtmlAttributes, addStyle, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";
import type { CustomElementProps } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.ts";
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header-text-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    if (!component?.isChildComponent) {
                        addStyle(getComponentContainerElement(host), {
                            padding: "0 0.75rem"
                        });
                    }
                    const htmlAttributes = new CustomElementHtmlAttributes(component as CustomElementProps);
                    host.innerHTML = "";
                    host.appendChild(createCustomElement("custom-header", htmlAttributes));
                }
            });
        }
    }
);
