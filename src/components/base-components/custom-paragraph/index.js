// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

// Local functions
import { renderParagraphElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-paragraph",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            if (!component?.isEmpty) {
                this.innerHTML = renderParagraphElement(component);
                addDevToolsOverlay(this, component);
            } else if (isDevMode()) {
                const hiddenEl = renderHiddenDevToolsElement(this, component);
                if (hiddenEl) this.appendChild(hiddenEl);
            }
        }
    }
);
