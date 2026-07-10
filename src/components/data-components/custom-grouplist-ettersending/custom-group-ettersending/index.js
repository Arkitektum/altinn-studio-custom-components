// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderKommentarElement, renderTemaElement, renderVedleggslisteElement } from "./renderers.js";

export default customElements.define(
    "custom-group-ettersending",
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
                        if (hasValue(component?.resourceValues?.data?.tittel) && component?.hideTitle !== true) {
                            containerElement.appendChild(renderHeaderElement(component?.resourceValues?.data?.tittel, component?.size));
                        }
                        containerElement.appendChild(renderTemaElement(component));
                        containerElement.appendChild(renderKommentarElement(component));
                        containerElement.appendChild(renderVedleggslisteElement(component));
                        host.appendChild(containerElement);
                    }
                }
            });
        }
    }
);
