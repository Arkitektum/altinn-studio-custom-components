// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { getListItemsFromKey } from "./functions.js";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const listItems = component?.itemKey?.length
                ? getListItemsFromKey(component?.formData?.data, component?.itemKey)
                : component?.formData?.data;
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
