// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { getFormDataValue } from "./function.js";

export default customElements.define(
    "custom-field-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && !component?.formData?.simpleBinding && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                component.setFormData({
                    simpleBinding: getFormDataValue(component)
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
