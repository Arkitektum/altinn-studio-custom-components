// Dependencies
import { addStyle } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-divider",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const dividerElement = document.createElement("hr");
            addStyle(dividerElement, component?.styleOverride);
            this.innerHTML = "";
            this.appendChild(dividerElement);
        }
    }
);
