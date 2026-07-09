// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderListFieldElement } from "./renderers.js";

export default customElements.define(
    "custom-field-list-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const fieldListDataElement = renderListFieldElement(component);
                    host.innerHTML = "";
                    host.appendChild(fieldListDataElement);
                }
            });
        }
    }
);
