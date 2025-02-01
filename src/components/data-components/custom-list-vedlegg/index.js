import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { getAttachmentListItems } from "./functions.js";

export default customElements.define(
    "custom-list-vedlegg",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const attachmentListItems = getAttachmentListItems(data);
            const title = !hideTitle && text;
            if (hideIfEmpty && !hasValue(attachmentListItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (emptyFieldText?.length && !attachmentListItems?.length) {
                this.innerHTML = createCustomElement("custom-field", {
                    data: emptyFieldText,
                    text: title,
                    styleoverride
                }).outerHTML;
            } else {
                this.innerHTML = createCustomElement("custom-list", {
                    data: attachmentListItems,
                    text: title,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
