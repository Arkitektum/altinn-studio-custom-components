// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement, getEmptyFieldText, hasValue } from "../../../functions/helpers.js";

// Local functions
import { getAttachmentListItems } from "./functions.js";

export default customElements.define(
    "custom-list-vedlegg",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const attachmentListItems = getAttachmentListItems(component?.formData?.data);
            const emptyFieldText = getEmptyFieldText(component);
            if (component?.hideIfEmpty && !hasValue(attachmentListItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (emptyFieldText?.length && !attachmentListItems?.length) {
                component.setFormData({ simpleBinding: emptyFieldText });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            } else {
                component.setFormData({ data: attachmentListItems });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-list", htmlAttributes).outerHTML;
            }
        }
    }
);
