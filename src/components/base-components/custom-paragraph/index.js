// Global functions
import { addStyle } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderParagraphElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-paragraph",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            if (!component?.isEmpty) {
                this.innerHTML = renderParagraphElement(component?.resourceValues?.title);
                addStyle(this, component?.styleOverride);
            }
        }
    }
);
