import { addStyle, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderParagraphElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-paragraph",
    class extends HTMLElement {
        connectedCallback() {
            const { text, styleOverride } = getCustomComponentProps(this);
            this.innerHTML = renderParagraphElement(text);
            addStyle(this, styleOverride);
        }
    }
);
