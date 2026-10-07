// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.ts";
import { instantiateComponent } from "../../../functions/componentHelpers.ts";

// Local functions
import { renderHeaderElement } from "./renderers.ts";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            if (!component?.isEmpty) {
                // The style override goes on the heading inside, in renderHeaderElement, and only there: margins and font size
                // have to reach the heading to beat the stylesheet's, and on both elements a padding or border showed twice.
                this.innerHTML = renderHeaderElement(component);
                addDevToolsOverlay(this, component, "base");
            } else if (isDevMode()) {
                const hiddenEl = renderHiddenDevToolsElement(this, component, "base");
                if (hiddenEl) this.appendChild(hiddenEl);
            }
        }
    }
);
