// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new instantiateComponent(this);
            console.log("custom-list-data", component);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                const tagName = component.isEmpty ? "custom-field" : "custom-list";
                this.innerHTML = createCustomElement(tagName, htmlAttributes).outerHTML;
            }
        }
    }
);
