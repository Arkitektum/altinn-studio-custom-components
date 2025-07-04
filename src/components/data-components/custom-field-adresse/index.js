// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement, getEmptyFieldText } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field-adresse",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const emptyFieldText = getEmptyFieldText(component);
                if (component.isEmpty) {
                    component.setFormData({ simpleBinding: emptyFieldText });
                }
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
