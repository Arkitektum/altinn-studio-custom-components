// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { addStyle } from "../../../functions/helpers.js";

// Local functions
import { renderListElement, renderListFieldElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-list",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            this.innerHTML = component?.text?.length
                ? renderListFieldElement(component?.text, component?.formData?.data)
                : renderListElement(component?.formData?.data);
            addStyle(this, component?.styleOverride);
        }
    }
);
