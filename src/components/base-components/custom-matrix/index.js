// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderMatrixElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-matrix",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "base",
                render: (host, component) => {
                    const matrixElement = renderMatrixElement(component);
                    host.innerHTML = "";
                    host.appendChild(matrixElement);
                }
            });
        }
    }
);
