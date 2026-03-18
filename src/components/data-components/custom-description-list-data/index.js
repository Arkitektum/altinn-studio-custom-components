// Dependencies
import { createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

export default customElements.define(
    "custom-description-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                const tagName = component.isEmpty ? "custom-field" : "custom-description-list";
                this.innerHTML = createCustomElement(tagName, htmlAttributes).outerHTML;
            }
        }
    }
);
