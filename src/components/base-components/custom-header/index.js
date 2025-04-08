// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

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
            const component = new CustomComponent(this);
            this.innerHTML = renderHeaderElement(component?.text, component?.size);
            addStyle(this, component?.styleOverride);
        }
    }
);
