// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

// Local functions
import { renderTableElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-table",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component);
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else {
                const tableElement = renderTableElement(component);
                this.innerHTML = "";
                this.appendChild(tableElement);
                addDevToolsOverlay(this, component);
            }
        }
    }
);
