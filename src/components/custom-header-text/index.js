import { addStyle, getCustomComponentProps } from "../../functions/helpers.js";
import { renderHeaderElement } from "./functions.js";

export default customElements.define(
    "custom-header-text",
    class extends HTMLElement {
        connectedCallback() {
            const { text, styleoverride } = getCustomComponentProps(this);
            const size = this.getAttribute("size");
            this.innerHTML = renderHeaderElement(text, size, styleoverride);
            addStyle(this, {
                display: "block",
                pageBreakAfter: "avoid",
                pageBreakInside: "avoid"
            });
        }
    }
);
