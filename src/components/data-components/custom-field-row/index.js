// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderFieldRowElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field-row",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "data");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else {
                const rowElement = renderFieldRowElement(component);
                this.appendChild(rowElement);
                addDevToolsOverlay(this, component, "data");
            }
        }
    }
);
