import Adresse from "../../../classes/data-classes/Adresse.js";
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { formatAdresse } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field-adresse",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const address = new Adresse(component?.formData?.data);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && !hasValue(address) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const adresseString = formatAdresse(address);
                component.setFormData({
                    simpleBinding: adresseString?.length ? adresseString : component?.emptyFieldText
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
