import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

export default customElements.define(
    "custom-feedback-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const value = component?.formData?.simpleBinding;
            if (!hasValue(value) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                component.setFormData({
                    simpleBinding: value
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-feedback", htmlAttributes).outerHTML;
            }
        }
    }
);
