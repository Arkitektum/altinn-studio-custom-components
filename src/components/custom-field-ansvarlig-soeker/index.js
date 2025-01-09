import { objectHasValue, renderFieldElement } from "../../functions/helpers.js";

customElements.define(
    "custom-field-ansvarlig-soeker",
    class extends HTMLElement {
        formatName(ansvarligSoeker) {
            let name = ansvarligSoeker?.navn || "";
            name += ansvarligSoeker?.organisasjonsnummer?.length
                ? `\n Organisasjonsnummer: ${ansvarligSoeker.organisasjonsnummer}`
                : "";
            return name;
        }

        connectedCallback() {
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const styleoverride = JSON.parse(this.getAttribute("styleoverride"));
            const title = !hideTitle && this.getAttribute("text");
            if (hideIfEmpty && !objectHasValue(formdata.data)) {
                this.style.display = "none";
            } else {
                const phoneNumbersString = this.formatName(formdata.data);
                this.innerHTML = renderFieldElement(
                    title,
                    phoneNumbersString?.length ? phoneNumbersString : emptyFieldText,
                    true,
                    styleoverride
                );
            }
        }
    }
);
