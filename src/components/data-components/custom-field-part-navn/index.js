import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { formatName } from "./functions.js";
import Part from "../../../classes/Part.js";

export default customElements.define(
    "custom-field-part-navn",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const part = new Part(data);
            if (hideIfEmpty && !hasValue(part) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const hideOrgNr = this.getAttribute("hideOrgNr") === "true";
                const name = formatName(part, hideOrgNr);
                this.innerHTML = createCustomElement("custom-field", {
                    data: name?.length ? name : emptyFieldText,
                    text: title,
                    inline,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
