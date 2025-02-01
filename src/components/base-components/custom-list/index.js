import {
    addGlobalStylesheet,
    addStyle,
    getCustomComponentProps,
    renderListElement,
    renderListFieldElement
} from "../../../functions/helpers.js";

import styles from "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-list",
    class extends HTMLElement {
        connectedCallback() {
            addGlobalStylesheet(`${this.tagName}-styles`, styles);
            const { data, text, styleoverride } = getCustomComponentProps(this);
            this.innerHTML = text?.length ? renderListFieldElement(text, data) : renderListElement(data);
            addStyle(this, styleoverride);
        }
    }
);
