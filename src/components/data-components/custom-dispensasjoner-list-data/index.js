// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderDispensasjonerListElement } from "./renderers.js";

export default customElements.define(
    "custom-dispensasjoner-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const headerElement = renderDispensasjonerListElement(component);
                this.innerHTML = headerElement.outerHTML;
            }
        }
    }
);
