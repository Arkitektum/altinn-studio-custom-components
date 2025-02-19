import Prosjekt from "../../../classes/Prosjekt.js";
import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { formatProsjekt } from "./functions.js";

export default customElements.define(
    "custom-field-prosjekt",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const prosjekt = new Prosjekt(formData?.data);
            if (hideIfEmpty && !hasValue(prosjekt) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const prosjektString = formatProsjekt(prosjekt);
                const value = prosjektString?.length ? prosjektString : emptyFieldText;
                this.innerHTML = createCustomElement("custom-field", {
                    formData: { simpleBinding: value },
                    text: title,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
