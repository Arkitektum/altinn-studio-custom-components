import { renderFieldElement } from "../../functions/helpers.js";

customElements.define(
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
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const title = !hideTitle && this.getAttribute("text");
            const statusText = this.getStatusText(formdata?.data);
            this.innerHTML = renderFieldElement(title, statusText);
        }
    }
);
