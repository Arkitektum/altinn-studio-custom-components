// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderErTillatelseGittElement, renderVegtypeElement } from "./renderers.js";

export default customElements.define(
    "custom-group-vegtype-tillatelse",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        host.appendChild(renderVegtypeElement(component));
                        host.appendChild(renderErTillatelseGittElement(component));
                    }
                }
            });
        }
    }
);
