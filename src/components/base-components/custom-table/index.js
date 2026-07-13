// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderTableElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "base",
                render: (host, component) => {
                    const tableElement = renderTableElement(component);
                    host.innerHTML = "";
                    host.appendChild(tableElement);
                }
            });
        }
    }
);
