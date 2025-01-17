import {
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement,
    renderListElement,
    renderListFieldElement
} from "../../functions/helpers.js";
import { getAttachmentListItems } from "./functions.js";

export default customElements.define(
    "custom-list-vedlegg",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const attachmentListItems = getAttachmentListItems(data);
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(attachmentListItems) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (emptyFieldText?.length && !attachmentListItems?.length) {
                this.innerHTML = renderFieldElement(title, emptyFieldText, true, styleoverride);
            } else {
                this.innerHTML = title?.length
                    ? renderListFieldElement(title, attachmentListItems)
                    : renderListElement(attachmentListItems);
            }
        }
    }
);
