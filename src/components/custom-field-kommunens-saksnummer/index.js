import { objectHasValue, renderFieldElement } from "../../functions/helpers.js";

customElements.define(
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
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const title = !hideTitle && this.getAttribute("text");
            if (hideIfEmpty && !objectHasValue(formdata.data)) {
                this.style.display = "none";
            } else {
                const kommunensSaksnummerString = this.formatKommunensSaksnummer(formdata.data);
                this.innerHTML = renderFieldElement(
                    title,
                    kommunensSaksnummerString?.length ? kommunensSaksnummerString : emptyFieldText
                );
            }
        }
    }
);
