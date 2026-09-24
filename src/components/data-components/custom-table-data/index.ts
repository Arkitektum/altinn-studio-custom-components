// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderTableElement } from "./renderers.ts";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const tableElement = renderTableElement(component);
                    host.appendChild(tableElement);
                }
            });
        }
    }
);
