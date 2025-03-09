import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { addStyle } from "../../../functions/helpers.js";
import { renderHeaderElement } from "./functions.js";
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
