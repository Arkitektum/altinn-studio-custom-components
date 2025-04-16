// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import {
    createCustomElement,
    getComponentContainerElement,
    getEmptyFieldText,
    hasValue,
    isNumberLargerThanZero
} from "../../../functions/helpers.js";

// Local functions
import { getFormDataCount } from "./functions.js";

export default customElements.define(
    "custom-field-count-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const formDataCount = getFormDataCount(component);
            if (component?.hideIfEmpty && !isNumberLargerThanZero(formDataCount) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const emptyFieldText = component?.texts?.emptyFieldText !== undefined ? getEmptyFieldText(component) : 0;
                component.setFormData({
                    simpleBinding: isNumberLargerThanZero(formDataCount) ? formDataCount : emptyFieldText
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
