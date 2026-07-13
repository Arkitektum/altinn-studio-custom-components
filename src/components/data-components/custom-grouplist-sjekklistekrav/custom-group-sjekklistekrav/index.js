// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderSjekklistepunk } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-group-sjekklistekrav",
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
                        containerElement.appendChild(renderSjekklistepunk(component));
                        host.appendChild(containerElement);
                    }
                }
            });
        }
    }
);
