import { addStyle, getComponentContainerElement, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderTableElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideIfEmpty, emptyFieldText, size, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderTableElement(data, text, size, emptyFieldText).outerHTML;
                addStyle(this, styleoverride);
            }
        }
    }
);
