// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderFieldElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const options = {
                    inline: component?.inline,
                    styleOverride: component?.styleOverride
                };
                this.innerHTML = renderFieldElement(component?.resourceValues?.title, component?.resourceValues?.data, options);
            }
        }
    }
);
