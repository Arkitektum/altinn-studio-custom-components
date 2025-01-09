import { objectHasValue, renderFieldElement, renderListElement, renderListFieldElement } from "../../functions/helpers.js";

customElements.define(
    "custom-list-data",
    class extends HTMLElement {
        getListItemsFromKey(items, itemKey) {
            return items.map((item) => item?.[itemKey]);
        }

        connectedCallback() {
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const title = !hideTitle && this.getAttribute("text");
            const itemKey = this.getAttribute("itemKey");
            const listItems = itemKey?.length ? this.getListItemsFromKey(formdata?.data, itemKey) : formdata?.data;
            if (hideIfEmpty && !objectHasValue(listItems)) {
                this.style.display = "none";
            } else if (emptyFieldText?.length && !listItems?.length) {
                this.innerHTML = renderFieldElement(title, emptyFieldText);
            } else {
                this.innerHTML = title?.length
                    ? renderListFieldElement(title, listItems)
                    : renderListElement(listItems);
            }
        }
    }
);
