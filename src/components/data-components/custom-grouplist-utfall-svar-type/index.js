// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderUtfallSvarType } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                if (component?.resourceValues?.data) {
                    Object.keys(component?.resourceValues?.data).forEach((utfallTypeKey) => {
                        const utfallTypeElement = renderUtfallSvarType(component, utfallTypeKey);
                        this.appendChild(utfallTypeElement);
                    });
                }
            }
        }
    }
);
