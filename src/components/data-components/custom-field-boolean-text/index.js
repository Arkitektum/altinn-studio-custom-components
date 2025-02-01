import { getComponentContainerElement, getCustomComponentProps } from "../../../functions/helpers.js";
import { getBooleanText } from "./functions.js";

export default customElements.define(
    "custom-field-boolean-text",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, inline, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const statusText = await getBooleanText(data, this);
            if (hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                this.innerHTML = createCustomElement("custom-field", {
                    data: statusText,
                    text: title,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
