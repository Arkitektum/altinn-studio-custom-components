import Telefonnumre from "../../classes/Telefonnumre.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";

export default customElements.define(
    "custom-field-telefonnummer",
    class extends HTMLElement {
        formatPhoneNumbers(telefonnumre) {
            const phoneNumbers = [telefonnumre.telefonnummer, telefonnumre.mobilnummer];
            return phoneNumbers.filter((nummerLinje) => nummerLinje?.length).join("\n");
        }
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const telefonnumre = new Telefonnumre(data);
            if (hideIfEmpty && !objectHasValue(telefonnumre)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const phoneNumbersString = this.formatPhoneNumbers(telefonnumre);
                const value = phoneNumbersString?.length ? phoneNumbersString : emptyFieldText;
                this.innerHTML = renderFieldElement(title, value, true, styleoverride);
            }
        }
    }
);
