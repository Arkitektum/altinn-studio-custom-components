import CustomComponent from "../../../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../../../functions/helpers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && !hasValue(component?.formData?.data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                for (const utfallSvar of component?.formData?.data) {
                    component.setFormData({ data: utfallSvar });
                    const htmlAttributes = new CustomElementHtmlAttributes({
                        formData: component?.formData,
                        texts: component?.texts,
                        hideIfEmpty: true
                    });
                    const utfallSvarElement = createCustomElement("custom-group-utfall-svar", htmlAttributes);
                    this.appendChild(utfallSvarElement);
                    const dividerElement = createCustomElement("custom-divider");
                    this.appendChild(dividerElement);
                }
            }
        }
    }
);
