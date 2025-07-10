// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../../functions/componentHelpers.js";

// Local functions
import { renderUtfallSvarGroup } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                for (const utfallSvar of component?.resourceValues?.data) {
                    const utfallSvarElement = renderUtfallSvarGroup(utfallSvar);
                    this.appendChild(utfallSvarElement);
                    const dividerElement = createCustomElement("custom-divider");
                    this.appendChild(dividerElement);
                }
            }
        }
    }
);
