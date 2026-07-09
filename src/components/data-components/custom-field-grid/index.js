// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderFieldGridElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field-grid",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => host.appendChild(renderFieldGridElement(component))
            });
        }
    }
);
