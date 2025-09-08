// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderHeaderElement, renderSummationElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-summation",
    class extends HTMLElement {
        connectedCallback() {
            const component = new instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);

            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const headerElement = renderHeaderElement(component?.resourceValues?.title, component?.size);
                const summationElement = renderSummationElement(component?.resourceValues?.data);
                this.innerHTML = "";
                if (headerElement) {
                    this.appendChild(headerElement);
                }
                this.appendChild(summationElement);
            }
        }
    }
);
