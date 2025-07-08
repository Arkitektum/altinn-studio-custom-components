// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderHeaderElement, renderTableElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const headerElement = renderHeaderElement(component?.resourceValues?.title, component?.size);
                const tableElement = renderTableElement(component);
                this.innerHTML = "";
                if (headerElement) {
                    this.appendChild(headerElement);
                }
                this.appendChild(tableElement);
            }
        }
    }
);
