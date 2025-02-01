import {
    addGlobalStylesheet,
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement,
    renderListElement,
    renderListFieldElement
} from "../../functions/helpers.js";
import { getListItemsFromKey } from "./functions.js";

import styles from "./styles.css" with { type: 'css' };


export default customElements.define(
    "custom-list",
    class extends HTMLElement {
        connectedCallback() {
            addGlobalStylesheet("custom-list-styles", styles);
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const itemKey = this.getAttribute("itemKey");
            const listItems = itemKey?.length ? getListItemsFromKey(data, itemKey) : data;
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(listItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
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
