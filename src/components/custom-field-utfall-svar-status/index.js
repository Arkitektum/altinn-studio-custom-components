import UtfallSvar from "../../classes/UtfallSvar.js";
import { getCustomComponentProps, renderFieldElement } from "../../functions/helpers.js";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        getStatusText(utfallSvar) {
            // TODO: Add support for text resources
            if (utfallSvar?.erUtfallBesvaresSenere) {
                return "Besvares senere";
            } else if (utfallSvar?.erUtfallBesvart) {
                return "Svar innsendt tidligere";
            } else {
                return "Besvares nå";
            }
        }
        connectedCallback() {
            const { data, text, hideTitle, styleoverride } = getCustomComponentProps(this);
            const utfallSvar = new UtfallSvar(data);
            const title = !hideTitle && text;
            const statusText = this.getStatusText(utfallSvar);
            this.innerHTML = renderFieldElement(title, statusText, true, styleoverride);
        }
    }
);
