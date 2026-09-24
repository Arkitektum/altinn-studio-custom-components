// Global functions
import { addDevToolsOverlay } from "../../../functions/devToolsHelpers.ts";
import { instantiateComponent } from "../../../functions/componentHelpers.ts";

// Local functions
import { renderListElement, renderListFieldElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-description-list",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            this.innerHTML = component?.resourceValues?.title?.length
                ? renderListFieldElement(component?.resourceValues?.title, component?.resourceValues?.data, component?.styleOverride)
                : renderListElement(component?.resourceValues?.data, component?.styleOverride);
            addDevToolsOverlay(this, component, "base");
        }
    }
);
