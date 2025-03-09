import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { formatName } from "./functions.js";
import Part from "../../../classes/data-classes/Part.js";
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

export default customElements.define(
    "custom-field-part-navn",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const part = new Part(component?.formData?.data);
            if (component?.hideIfEmpty && !hasValue(part) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const name = formatName(part, component?.hideOrgNr);
                component.setFormData({ simpleBinding: name?.length ? name : component?.emptyFieldText });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
