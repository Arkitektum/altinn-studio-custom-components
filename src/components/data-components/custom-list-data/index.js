import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { getListItemsFromKey } from "./functions.js";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const listItems = component?.itemKey?.length
                ? getListItemsFromKey(component?.formData?.data, component?.itemKey)
                : component?.formData?.data;
            if (component?.hideIfEmpty && !hasValue(listItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.emptyFieldText?.length && !listItems?.length) {
                component.setFormData({ simpleBinding: component?.emptyFieldText });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            } else {
                component.setFormData({ data: listItems });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-list", htmlAttributes).outerHTML;
            }
        }
    }
);
