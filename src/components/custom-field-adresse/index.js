import Adresse from "../../classes/Adresse.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";
import { formatAdresse } from "./functions.js";

export default customElements.define(
    "custom-field-adresse",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const address = new Adresse(data);
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(address)) {
                this.style.display = "none";
            } else {
                const adresseString = formatAdresse(address);
                this.innerHTML = renderFieldElement(
                    title,
                    adresseString?.length ? adresseString : emptyFieldText,
                    true,
                    styleoverride
                );
            }
        }
    }
);
