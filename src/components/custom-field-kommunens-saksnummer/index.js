import KommunensSaksnummer from "../../classes/KommunensSaksnummer.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";
import { formatKommunensSaksnummer } from "./functions.js";

export default customElements.define(
    "custom-field-kommunens-saksnummer",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const kommunensSaksnummer = new KommunensSaksnummer(data);
            if (hideIfEmpty && !objectHasValue(kommunensSaksnummer)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const kommunensSaksnummerString = formatKommunensSaksnummer(kommunensSaksnummer);
                this.innerHTML = renderFieldElement(
                    title,
                    kommunensSaksnummerString?.length ? kommunensSaksnummerString : emptyFieldText
                );
            }
        }
    }
);
