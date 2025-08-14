// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderListFieldElement } from "./renderers.js";

export default customElements.define(
    "custom-field-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const fieldListDataElement = renderListFieldElement(component);
                this.innerHTML = fieldListDataElement.outerHTML;
            }
        }
    }
);
