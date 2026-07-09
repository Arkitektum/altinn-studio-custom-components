// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderFieldElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "base",
                render: (host, component) => {
                    const options = {
                        inline: component?.inline,
                        styleOverride: component?.styleOverride,
                        enableLinks: component?.enableLinks
                    };
                    host.innerHTML = renderFieldElement(component?.resourceValues?.title, component?.resourceValues?.data, options);
                }
            });
        }
    }
);
