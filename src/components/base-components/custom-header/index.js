import { addStyle, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderHeaderElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header",
    class extends HTMLElement {
        connectedCallback() {
            const { text, styleoverride } = getCustomComponentProps(this);
            const size = this.getAttribute("size");
            this.innerHTML = renderHeaderElement(text, size, styleoverride);
            addStyle(this, styleoverride);
        }
    }
);
