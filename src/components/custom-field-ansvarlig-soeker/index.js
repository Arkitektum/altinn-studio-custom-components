import AnsvarligSoeker from "../../classes/AnsvarligSoeker.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";
import { formatName } from "./functions.js";

export default customElements.define(
    "custom-field-ansvarlig-soeker",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const ansvarligSoeker = new AnsvarligSoeker(data);
            if (hideIfEmpty && !objectHasValue(ansvarligSoeker)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const phoneNumbersString = formatName(ansvarligSoeker);
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
