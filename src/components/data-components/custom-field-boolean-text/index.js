import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";
import { getBooleanText } from "./functions.js";

export default customElements.define(
    "custom-field-boolean-text",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const statusText = await getBooleanText(component?.formData?.simpleBinding, this);
            if (component?.hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                component.setFormData({ simpleBinding: statusText });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
