import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { getListItemsFromKey } from "./functions.js";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, styleOverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const itemKey = this.getAttribute("itemKey");
            const listItems = itemKey?.length ? getListItemsFromKey(formData?.data, itemKey) : formData?.data;
            const title = !hideTitle && text;
            if (hideIfEmpty && !hasValue(listItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (emptyFieldText?.length && !listItems?.length) {
                this.innerHTML = createCustomElement("custom-field", {
                    formData: { simpleBinding: emptyFieldText },
                    text: title,
                    styleOverride
                }).outerHTML;
            } else {
                this.innerHTML = createCustomElement("custom-list", {
                    formData: { data: listItems },
                    text: title,
                    styleOverride
                }).outerHTML;
            }
        }
    }
);
