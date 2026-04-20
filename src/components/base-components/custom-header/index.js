// Dependencies
import { addStyle } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

// Local functions
import { renderHeaderElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            if (!component?.isEmpty) {
                this.innerHTML = renderHeaderElement(component);
                addStyle(this, component?.styleOverride);
                addDevToolsOverlay(this, component, "base");
            } else if (isDevMode()) {
                const hiddenEl = renderHiddenDevToolsElement(this, component, "base");
                if (hiddenEl) this.appendChild(hiddenEl);
            }
        }
    }
);
