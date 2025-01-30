import Telefonnumre from "../../classes/Telefonnumre";
import {
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement
} from "../../functions/helpers";
import { formatPhoneNumbers } from "./functions";

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
                const options = {
                    inline,
                    styleoverride
                };
                this.innerHTML = renderFieldElement(title, value, options);
            }
        }
    }
);
