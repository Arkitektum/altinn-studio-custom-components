// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

export default customElements.define(
    "custom-list-data",
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
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                const tagName = component.isEmpty ? "custom-field" : "custom-list";
                this.innerHTML = "";
                this.appendChild(createCustomElement(tagName, htmlAttributes));
                addDevToolsOverlay(this, component, "data");
            }
        }
    }
);
