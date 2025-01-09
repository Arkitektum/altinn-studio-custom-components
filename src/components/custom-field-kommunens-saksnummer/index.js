import KommunensSaksnummer from "../../classes/KommunensSaksnummer.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";

export default customElements.define(
    "custom-field-kommunens-saksnummer",
    class extends HTMLElement {
        formatKommunensSaksnummer(kommunensSaksnummer) {
            const kommunensSaksnummerParts = [
                kommunensSaksnummer?.saksaar.toString(),
                kommunensSaksnummer?.sakssekvensnummer.toString()
            ];
            return kommunensSaksnummerParts
                .filter((kommunensSaksnummerPart) => kommunensSaksnummerPart?.length)
                .join("/");
        }
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const kommunensSaksnummer = new KommunensSaksnummer(data);
            if (hideIfEmpty && !objectHasValue(kommunensSaksnummer)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const kommunensSaksnummerString = this.formatKommunensSaksnummer(kommunensSaksnummer);
                this.innerHTML = renderFieldElement(
                    title,
                    kommunensSaksnummerString?.length ? kommunensSaksnummerString : emptyFieldText
                );
            }
        }
    }
);
