// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderSjekklistepunkHeader } from "./renderers.ts";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-group-sjekklistekrav-header-text",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                // Column headings with nothing to label are never useful, so they hide without the host asking.
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
                    const containerElement = document.createElement("div");
                    containerElement.appendChild(renderSjekklistepunkHeader(component));
                    host.appendChild(containerElement);
                }
            });
        }
    }
);
