import KommunensSaksnummer from "../../../classes/data-classes/KommunensSaksnummer.js";
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { formatKommunensSaksnummer } from "./functions.js";

export default customElements.define(
    "custom-field-kommunens-saksnummer",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const kommunensSaksnummer = new KommunensSaksnummer(component?.formData?.data);
            if (component?.hideIfEmpty && !hasValue(kommunensSaksnummer) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const kommunensSaksnummerString = formatKommunensSaksnummer(kommunensSaksnummer);
                component.setFormData({
                    simpleBinding: kommunensSaksnummerString?.length ? kommunensSaksnummerString : component?.emptyFieldText
                });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
