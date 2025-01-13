import { getCustomComponentProps, renderFieldElement } from "../../functions/helpers";
import { getBooleanText } from "./functions";

export default customElements.define(
    "custom-field-boolean-text",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, styleoverride } = getCustomComponentProps(this);
            const title = !hideTitle && text;
            const statusText = await getBooleanText(data, this);
            this.innerHTML = renderFieldElement(title, statusText, true, styleoverride);
        }
    }
);
