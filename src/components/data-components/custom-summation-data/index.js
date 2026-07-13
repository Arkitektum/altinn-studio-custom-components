// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderSummationData } from "./renderers.js";

export default customElements.define(
    "custom-summation-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const summationDataElement = renderSummationData(component);
                    host.appendChild(summationDataElement);
                }
            });
        }
    }
);
