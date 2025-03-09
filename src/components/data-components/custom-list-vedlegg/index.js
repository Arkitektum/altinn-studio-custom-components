import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { getAttachmentListItems } from "./functions.js";

export default customElements.define(
    "custom-list-vedlegg",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const attachmentListItems = getAttachmentListItems(component?.formData?.data);
            if (component?.hideIfEmpty && !hasValue(attachmentListItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.emptyFieldText?.length && !attachmentListItems?.length) {
                component.setFormData({ simpleBinding: component?.emptyFieldText });
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
