import AnsvarligSoeker from "../../classes/AnsvarligSoeker.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";

export default customElements.define(
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
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const ansvarligSoeker = new AnsvarligSoeker(data);
            if (hideIfEmpty && !objectHasValue(ansvarligSoeker)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const phoneNumbersString = this.formatName(ansvarligSoeker);
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
