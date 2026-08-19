// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderVegtypeTillatelseElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-vegtype-tillatelse",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    // Reached only when the component should not hide itself, so an empty one still explains itself.
                    if (component?.isEmpty) {
                        host.appendChild(renderEmptyFieldText(component));
                        return;
                    }
                    const vegtypeTillatelseData = component?.resourceValues?.data;
                    if (!Array.isArray(vegtypeTillatelseData)) {
                        return;
                    }
                    for (const vegtypeTillatelse of vegtypeTillatelseData) {
                        host.appendChild(renderVegtypeTillatelseElement(component, vegtypeTillatelse));
                    }
                }
            });
        }
    }
);
