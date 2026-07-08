// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderMatrixElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-matrix",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "base");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else {
                const matrixElement = renderMatrixElement(component);
                this.innerHTML = "";
                this.appendChild(matrixElement);
                addDevToolsOverlay(this, component, "base");
            }
        }
    }
);
