// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderAnsvarsrettAnsvarsomraadeTable } from "./renderers.ts";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-ansvarsrett-ansvarsomraade",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const ansvarsrettAnsvarsomraadeTableElement = renderAnsvarsrettAnsvarsomraadeTable(component);
                    host.appendChild(ansvarsrettAnsvarsomraadeTableElement);
                }
            });
        }
    }
);
