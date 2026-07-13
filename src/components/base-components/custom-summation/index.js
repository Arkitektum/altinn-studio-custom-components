// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderHeaderElement, renderSummationElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-summation",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "base",
                render: (host, component) => {
                    const summationElement = renderSummationElement(component?.resourceValues?.data);
                    host.innerHTML = "";
                    if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                    }
                    host.appendChild(summationElement);
                }
            });
        }
    }
);
