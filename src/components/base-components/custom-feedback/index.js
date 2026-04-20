// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

// Local functions
import { renderFeedbackElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedback",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const value = component?.resourceValues?.data;
            if (component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "base");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else {
                this.innerHTML = renderFeedbackElement(value, component?.feedbackType);
                addDevToolsOverlay(this, component, "base");
            }
        }
    }
);
