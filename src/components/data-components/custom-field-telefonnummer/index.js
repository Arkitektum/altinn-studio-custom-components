// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import Telefonnumre from "../../../classes/data-classes/Telefonnumre.js";

// Global functions
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import { formatPhoneNumbers } from "./functions.js";

export default customElements.define(
    "custom-field-telefonnummer",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const telefonnumre = new Telefonnumre(component?.formData?.data);
            if (component?.hideIfEmpty && !hasValue(telefonnumre) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const phoneNumbersString = formatPhoneNumbers(telefonnumre);
                const value = phoneNumbersString?.length ? phoneNumbersString : component?.emptyFieldText;
                component.setFormData({ simpleBinding: value });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
