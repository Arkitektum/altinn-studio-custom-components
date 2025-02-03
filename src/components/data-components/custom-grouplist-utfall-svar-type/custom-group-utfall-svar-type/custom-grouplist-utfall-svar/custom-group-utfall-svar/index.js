import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../../../../functions/helpers.js";
import {
    getBeskrivelseElement,
    getKommentarElement,
    getStatusElement,
    getTemaElement,
    getVedleggslisteElement
} from "./functions.js";

export default customElements.define(
    "custom-group-utfall-svar",
    class extends HTMLElement {
        async connectedCallback() {
            const { data } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const texts = JSON.parse(this.getAttribute("texts"));
            if (!hasValue(data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const containerElement = document.createElement("div");
                const headerElement = createCustomElement("custom-header-text", {
                    text: data?.tittel,
                    size: "h3"
                });
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
