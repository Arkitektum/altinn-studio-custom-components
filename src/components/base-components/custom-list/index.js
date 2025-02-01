import { addStyle, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderListElement, renderListFieldElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-list",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, styleoverride } = getCustomComponentProps(this);
            this.innerHTML = text?.length ? renderListFieldElement(text, data) : renderListElement(data);
            addStyle(this, styleoverride);
        }
    }
);
