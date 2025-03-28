import CustomComponent from "../../../../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../../../../functions/helpers.js";
import { getBeskrivelseElement, getKommentarElement, getStatusElement, getTemaElement, getVedleggslisteElement } from "./functions.js";

export default customElements.define(
    "custom-group-utfall-svar",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const texts = component?.texts;
            const data = component?.formData?.data;
            if (!hasValue(data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const containerElement = document.createElement("div");
                const headerHtmlAttributes = new CustomElementHtmlAttributes({
                    text: data?.tittel,
                    size: "h3"
                });
                const headerElement = createCustomElement("custom-header-text", headerHtmlAttributes);
                containerElement.appendChild(headerElement);
                containerElement.appendChild(getBeskrivelseElement(data, texts));
                containerElement.appendChild(getStatusElement(data, texts));
                containerElement.appendChild(getTemaElement(data, texts));
                containerElement.appendChild(getKommentarElement(data, texts));
                containerElement.appendChild(getVedleggslisteElement(data, texts));
                this.appendChild(containerElement);
            }
        }
    }
);
