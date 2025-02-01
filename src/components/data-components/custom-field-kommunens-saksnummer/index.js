import KommunensSaksnummer from "../../../classes/KommunensSaksnummer.js";
import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { formatKommunensSaksnummer } from "./functions.js";

export default customElements.define(
    "custom-field-kommunens-saksnummer",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const kommunensSaksnummer = new KommunensSaksnummer(data);
            if (hideIfEmpty && !hasValue(kommunensSaksnummer) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const kommunensSaksnummerString = formatKommunensSaksnummer(kommunensSaksnummer);
                this.innerHTML = createCustomElement("custom-field", {
                    data: kommunensSaksnummerString?.length ? kommunensSaksnummerString : emptyFieldText,
                    text: title,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
