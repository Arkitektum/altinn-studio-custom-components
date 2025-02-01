import { addGlobalStylesheet, addStyle, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderHeaderElement } from "./functions.js";
import styles from "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-header",
    class extends HTMLElement {
        connectedCallback() {
            addGlobalStylesheet(`${this.tagName}-styles`, styles);
            const { text, styleoverride } = getCustomComponentProps(this);
            const size = this.getAttribute("size");
            this.innerHTML = renderHeaderElement(text, size, styleoverride);
            addStyle(this, styleoverride);
        }
    }
);
