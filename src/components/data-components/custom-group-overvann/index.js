// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderHeaderElement,
    renderLedesOvervannTilAvloepssystemElement,
    renderLedesOvervannTilTerrengElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-overvann",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                    }
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        host.appendChild(renderLedesOvervannTilTerrengElement(component));
                        host.appendChild(renderLedesOvervannTilAvloepssystemElement(component));
                    }
                }
            });
        }
    }
);
