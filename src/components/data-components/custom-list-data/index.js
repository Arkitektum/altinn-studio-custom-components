import { getComponentContainerElement, getCustomComponentProps, objectHasValue } from "../../../functions/helpers.js";
import { getListItemsFromKey } from "./functions.js";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const itemKey = this.getAttribute("itemKey");
            const listItems = itemKey?.length ? getListItemsFromKey(data, itemKey) : data;
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(listItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (emptyFieldText?.length && !listItems?.length) {
                this.innerHTML = createCustomElement("custom-field", {
                    data: emptyFieldText,
                    text: title,
                    styleoverride
                }).outerHTML;
            } else {
                this.innerHTML = createCustomElement("custom-list", {
                    data: listItems,
                    text: title,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
