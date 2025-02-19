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
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const attachmentListItems = getAttachmentListItems(formData?.data);
            const title = !hideTitle && text;
            if (hideIfEmpty && !hasValue(attachmentListItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (emptyFieldText?.length && !attachmentListItems?.length) {
                this.innerHTML = createCustomElement("custom-field", {
                    formData: { simpleBinding: emptyFieldText },
                    text: title,
                    styleoverride
                }).outerHTML;
            } else {
                this.innerHTML = createCustomElement("custom-list", {
                    formData: { data: attachmentListItems },
                    text: title,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
