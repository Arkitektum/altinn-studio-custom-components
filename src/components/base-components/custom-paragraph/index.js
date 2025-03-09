import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { addStyle } from "../../../functions/helpers.js";
import { renderParagraphElement } from "./functions.js";
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
