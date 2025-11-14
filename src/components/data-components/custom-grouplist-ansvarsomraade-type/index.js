// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderAnsvarsomraadeType } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-ansvarsomraade-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.resourceValues?.data) {
                for (const ansvarsomraadeTypeKey of Object.keys(component?.resourceValues?.data)) {
                    const ansvarsomraadeTypeElement = renderAnsvarsomraadeType(component, ansvarsomraadeTypeKey);
                    this.appendChild(ansvarsomraadeTypeElement);
                }
            }
        }
    }
);
