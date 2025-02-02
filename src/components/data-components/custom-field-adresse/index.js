import Adresse from "../../../classes/Adresse.js";
import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { formatAdresse } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field-adresse",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const address = new Adresse(data);
            if (hideIfEmpty && !hasValue(address) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const adresseString = formatAdresse(address);
                this.innerHTML = createCustomElement("custom-field", {
                    data: adresseString?.length ? adresseString : emptyFieldText,
                    text: title,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
