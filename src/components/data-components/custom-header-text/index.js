// Dependencies
import { addStyle, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header-text",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            if (!component?.isChildComponent) {
                const containerElement = getComponentContainerElement(this);
                addStyle(containerElement, {
                    padding: "0 0.75rem"
                });
            }
            const htmlAttributes = new CustomElementHtmlAttributes(component);
            this.innerHTML = createCustomElement("custom-header", htmlAttributes).outerHTML;
        }
    }
);
