// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderEmptyFieldText, renderEttersendingGroup, renderHeaderElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-ettersending",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else {
                this.appendChild(renderHeaderElement(component, "h2"));
                for (const ettersending of component?.resourceValues?.data) {
                    const ettersendingElement = renderEttersendingGroup(ettersending);
                    this.appendChild(ettersendingElement);
                    const dividerElement = createCustomElement("custom-divider");
                    this.appendChild(dividerElement);
                }
            }
        }
    }
);
