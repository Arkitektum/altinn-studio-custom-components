// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderDispensasjonCount, renderDispensasjonTable, renderEmptyFieldText, renderHeaderElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-group-dispensasjon-oversikt",
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
                        host.appendChild(renderDispensasjonCount(component));
                        host.appendChild(renderDispensasjonTable(component));
                    }
                }
            });
        }
    }
);
