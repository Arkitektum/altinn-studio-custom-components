// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";

// Local functions
import { renderSjekklistepunkHeader } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-group-sjekklistekrav-header-text",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.isEmpty) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "data");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else if (componentContainerElement) {
                    componentContainerElement.style.display = "none";
                } else {
                    this.style.display = "none";
                }
            } else {
                const containerElement = document.createElement("div");
                containerElement.appendChild(renderSjekklistepunkHeader(component));
                this.appendChild(containerElement);
                addDevToolsOverlay(this, component, "data");
            }
        }
    }
);
