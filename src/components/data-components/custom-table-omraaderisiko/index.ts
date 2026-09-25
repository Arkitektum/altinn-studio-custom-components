// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderOmraaderisikoTable } from "./renderers.ts";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table-omraaderisiko",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const omraaderisikoTableElement = renderOmraaderisikoTable(component);
                    host.appendChild(omraaderisikoTableElement);
                }
            });
        }
    }
);
