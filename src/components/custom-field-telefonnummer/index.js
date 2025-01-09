import { objectHasValue, renderFieldElement } from "../../functions/helpers.js";

customElements.define(
    "custom-field-telefonnummer",
    class extends HTMLElement {
        formatPhoneNumbers(kontaktperson) {
            const phoneNumbers = [kontaktperson.telefonnummer, kontaktperson.mobilnummer];
            return phoneNumbers.filter((nummerLinje) => nummerLinje?.length).join("\n");
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
                const phoneNumbersString = this.formatPhoneNumbers(formdata.data);
                this.innerHTML = renderFieldElement(
                    title,
                    phoneNumbersString?.length ? phoneNumbersString : emptyFieldText
                );
            }
        }
    }
);
