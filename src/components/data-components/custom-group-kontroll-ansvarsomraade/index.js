// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import {
    renderAnsvarsrettErklaertElement,
    renderArbeidetAvsluttetElement,
    renderBeskrivelseElement,
    renderEmptyFieldText,
    renderFunksjonElement,
    renderFunnetAvvikElement,
    renderHeaderElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-kontroll-ansvarsomraade",
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
                        const containerElement = document.createElement("div");

                        containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.ansvarsomraade?.title, component?.size));

                        containerElement.appendChild(renderFunksjonElement(component));
                        containerElement.appendChild(renderBeskrivelseElement(component));
                        containerElement.appendChild(renderAnsvarsrettErklaertElement(component));
                        containerElement.appendChild(renderArbeidetAvsluttetElement(component));

                        containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.sluttrapport?.title, component?.size));
                        containerElement.appendChild(renderFunnetAvvikElement(component));

                        host.appendChild(containerElement);
                    }
                }
            });
        }
    }
);
