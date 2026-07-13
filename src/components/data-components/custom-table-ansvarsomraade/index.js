// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderAnsvarsomraadeTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-ansvarsomraade",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const ansvarsomraadeTableElement = renderAnsvarsomraadeTable(component);
                    host.appendChild(ansvarsomraadeTableElement);
                }
            });
        }
    }
);
