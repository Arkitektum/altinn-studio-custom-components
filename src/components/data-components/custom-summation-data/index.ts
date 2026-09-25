// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderSummationData } from "./renderers.ts";

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
