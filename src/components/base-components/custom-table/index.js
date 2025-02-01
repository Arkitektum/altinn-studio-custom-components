import { addStyle, getComponentContainerElement, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderHeaderElement, renderTableElement } from "./functions.js";
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
                const headerElement = renderHeaderElement(text, size);
                const tableElement = renderTableElement(data, emptyFieldText);
                this.innerHTML = "";
                if (headerElement) {
                    this.appendChild(headerElement);
                }
                this.appendChild(tableElement);
                addStyle(this, styleoverride);
            }
        }
    }
);
