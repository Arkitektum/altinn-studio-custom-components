import { addStyle, getCustomComponentProps } from "../../../functions/helpers.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-divider",
    class extends HTMLElement {
        connectedCallback() {
            const { styleoverride } = getCustomComponentProps(this);
            const dividerElement = document.createElement("hr");
            addStyle(dividerElement, styleoverride);
            this.innerHTML = "";
            this.appendChild(dividerElement);
        }
    }
);
