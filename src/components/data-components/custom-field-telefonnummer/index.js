import Telefonnumre from "../../../classes/Telefonnumre.js";
import { getComponentContainerElement, getCustomComponentProps, objectHasValue } from "../../../functions/helpers.js";
import { formatPhoneNumbers } from "./functions.js";

export default customElements.define(
    "custom-field-telefonnummer",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const telefonnumre = new Telefonnumre(data);
            if (hideIfEmpty && !objectHasValue(telefonnumre) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const phoneNumbersString = formatPhoneNumbers(telefonnumre);
                const value = phoneNumbersString?.length ? phoneNumbersString : emptyFieldText;
                this.innerHTML = createCustomElement("custom-field", {
                    data: value,
                    text: title,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
