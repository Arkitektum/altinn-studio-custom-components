// Classes
import Adresse from "../../../classes/data-classes/Adresse.js";
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement, getEmptyFieldText, hasValue } from "../../../functions/helpers.js";

// Local functions
import { formatAdresse } from "./functions.js";

// Stylesheet
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
                const emptyFieldText = getEmptyFieldText(component);
                component.setFormData({
                    simpleBinding: adresseString?.length ? adresseString : emptyFieldText
                });
                if (emptyFieldText) {
                    component.setTexts({
                        ...component?.texts,
                        emptyFieldText: emptyFieldText
                    });
                }
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
