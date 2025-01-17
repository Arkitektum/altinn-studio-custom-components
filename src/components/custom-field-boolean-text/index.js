import { getComponentContainerElement, getCustomComponentProps, renderFieldElement } from "../../functions/helpers";
import { getBooleanText } from "./functions";

export default customElements.define(
    "custom-field-boolean-text",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const title = !hideTitle && text;
            const statusText = await getBooleanText(data, this);
            if (hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFieldElement(title, statusText, true, styleoverride);
            }
        }
    }
);
