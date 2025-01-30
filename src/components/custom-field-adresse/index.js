import Adresse from "../../classes/Adresse";
import {
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement
} from "../../functions/helpers";
import { formatAdresse } from "./functions";

export default customElements.define(
    "custom-field-adresse",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const address = new Adresse(data);
            if (hideIfEmpty && !objectHasValue(address) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const adresseString = formatAdresse(address);
                const options = {
                    inline,
                    styleoverride
                };
                this.innerHTML = renderFieldElement(
                    title,
                    adresseString?.length ? adresseString : emptyFieldText,
                    options
                );
            }
        }
    }
);
