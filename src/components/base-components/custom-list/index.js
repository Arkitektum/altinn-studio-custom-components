// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderListElement, renderListFieldElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-list",
    class extends HTMLElement {
        connectedCallback() {
            const component = new instantiateComponent(this);
            this.innerHTML = component?.resourceValues?.title?.length ? renderListFieldElement(component) : renderListElement(component);
        }
    }
);
