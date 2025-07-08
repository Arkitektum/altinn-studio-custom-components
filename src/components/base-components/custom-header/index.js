// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { addStyle } from "../../../functions/helpers.js";

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
                this.innerHTML = renderHeaderElement(component?.resourceValues?.title, component?.size);
                addStyle(this, component?.styleOverride);
            }
        }
    }
);
