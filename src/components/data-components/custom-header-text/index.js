// Dependencies
import { CustomElementHtmlAttributes, addStyle, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header-text",
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
                    const htmlAttributes = new CustomElementHtmlAttributes(component);
                    host.innerHTML = "";
                    host.appendChild(createCustomElement("custom-header", htmlAttributes));
                }
            });
        }
    }
);
