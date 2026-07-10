// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../../../../functions/componentRenderHelpers.js";

// Local functions
import {
    renderBeskrivelseElement,
    renderHeaderElement,
    renderKommentarElement,
    renderStatusElement,
    renderTemaElement,
    renderVedleggslisteElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const containerElement = document.createElement("div");
                    if (hasValue(component?.resourceValues?.data?.tittel) && component?.hideTitle !== true) {
                        containerElement.appendChild(renderHeaderElement(component?.resourceValues?.data?.tittel, component?.size));
                    }
                    containerElement.appendChild(renderBeskrivelseElement(component));
                    containerElement.appendChild(renderStatusElement(component));
                    containerElement.appendChild(renderTemaElement(component));
                    containerElement.appendChild(renderKommentarElement(component));
                    containerElement.appendChild(renderVedleggslisteElement(component));
                    host.appendChild(containerElement);
                }
            });
        }
    }
);
