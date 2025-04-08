// Classes
import CustomComponent from "../../../../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement, hasValue } from "../../../../../../functions/helpers.js";

// Local functions
import { renderBeskrivelseElement, renderKommentarElement, renderStatusElement, renderTemaElement, renderVedleggslisteElement } from "./renderers.js";

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
                containerElement.appendChild(renderBeskrivelseElement(data, texts));
                containerElement.appendChild(renderStatusElement(data, texts));
                containerElement.appendChild(renderTemaElement(data, texts));
                containerElement.appendChild(renderKommentarElement(data, texts));
                containerElement.appendChild(renderVedleggslisteElement(data, texts));
                this.appendChild(containerElement);
            }
        }
    }
);
