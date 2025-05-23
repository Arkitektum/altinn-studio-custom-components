// Classes
import Part from "../../../classes/data-classes/Part.js";
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement, getEmptyFieldText, hasValue } from "../../../functions/helpers.js";

// Local functions
import { formatName } from "./functions.js";

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
                const emptyFieldText = getEmptyFieldText(component);
                component.setFormData({ simpleBinding: name?.length ? name : emptyFieldText });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
