import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

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
                    simpleBinding: hasValue(component?.formData?.simpleBinding)
                        ? component?.formData?.simpleBinding
                        : component?.emptyFieldText
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
