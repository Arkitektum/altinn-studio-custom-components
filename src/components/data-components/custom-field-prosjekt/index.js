// Classes
import Prosjekt from "../../../classes/data-classes/Prosjekt.js";
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import { formatProsjekt } from "./functions.js";

export default customElements.define(
    "custom-field-prosjekt",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const prosjekt = new Prosjekt(component?.formData?.data);
            if (component?.hideIfEmpty && !hasValue(prosjekt) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const prosjektString = formatProsjekt(prosjekt);
                const value = prosjektString?.length ? prosjektString : component?.emptyFieldText;
                component.setFormData({ simpleBinding: value });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
