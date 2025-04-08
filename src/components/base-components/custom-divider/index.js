// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { addStyle } from "../../../functions/helpers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-divider",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const dividerElement = document.createElement("hr");
            addStyle(dividerElement, component?.styleOverride);
            this.innerHTML = "";
            this.appendChild(dividerElement);
        }
    }
);
