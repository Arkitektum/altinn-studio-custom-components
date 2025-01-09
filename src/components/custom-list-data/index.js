import {
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement,
    renderListElement,
    renderListFieldElement
} from "../../functions/helpers.js";

export default customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        getListItemsFromKey(items, itemKey) {
            return items.map((item) => item?.[itemKey]);
        }
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const itemKey = this.getAttribute("itemKey");
            const listItems = itemKey?.length ? this.getListItemsFromKey(data, itemKey) : data;
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(listItems)) {
                this.style.display = "none";
            } else if (emptyFieldText?.length && !listItems?.length) {
                this.innerHTML = renderFieldElement(title, emptyFieldText, true, styleoverride);
            } else {
                this.innerHTML = title?.length
                    ? renderListFieldElement(title, listItems)
                    : renderListElement(listItems);
            }
        }
    }
);
