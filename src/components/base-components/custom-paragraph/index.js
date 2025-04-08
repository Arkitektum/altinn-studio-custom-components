// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { addStyle } from "../../../functions/helpers.js";

// Local functions
import { renderParagraphElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-paragraph",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            this.innerHTML = renderParagraphElement(component?.text);
            addStyle(this, component?.styleOverride);
        }
    }
);
