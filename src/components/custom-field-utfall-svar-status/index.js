import UtfallSvar from "../../classes/UtfallSvar.js";
import { getCustomComponentProps, renderFieldElement } from "../../functions/helpers.js";
import { getStatusText } from "./functions.js";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, styleoverride } = getCustomComponentProps(this);
            const utfallSvar = new UtfallSvar(data);
            const title = !hideTitle && text;
            const statusText = await getStatusText(utfallSvar, this);
            if (hideIfEmpty && !statusText?.length) {
                this.style.display = "none";
            } else {
                this.innerHTML = renderFieldElement(title, statusText, true, styleoverride);
            }
        }
    }
);
