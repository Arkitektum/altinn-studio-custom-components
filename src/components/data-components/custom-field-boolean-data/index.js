// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { getBooleanData, getFormDataValue } from "./functions.js";

export default customElements.define(
    "custom-field-boolean-data",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const resultData = getBooleanData(component);
            if (component?.hideIfEmpty && !resultData?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                component.setFormData({
                    simpleBinding: getFormDataValue(component, resultData)
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
