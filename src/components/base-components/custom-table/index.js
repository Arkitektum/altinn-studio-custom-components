import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { renderHeaderElement, renderTableElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && !component?.formData?.data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const headerElement = renderHeaderElement(component?.text, component?.size);
                const tableElement = renderTableElement(component?.formData?.data, component?.emptyFieldText, component?.styleOverride);
                this.innerHTML = "";
                if (headerElement) {
                    this.appendChild(headerElement);
                }
                this.appendChild(tableElement);
            }
        }
    }
);
