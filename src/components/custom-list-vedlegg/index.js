import {
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement,
    renderListElement,
    renderListFieldElement
} from "../../functions/helpers.js";

export default customElements.define(
    "custom-list-vedlegg",
    class extends HTMLElement {
        getAttachmentDescription(attachment) {
            return attachment?.vedleggstype?.kodebeskrivelse;
        }
        getAttachmentFileName(attachment) {
            return attachment?.filnavn;
        }
        getAttachmentListItems(attachments) {
            return (
                attachments?.length &&
                attachments
                    .map((attachment) => {
                        const attachmentDescription = this.getAttachmentDescription(attachment);
                        const attachmentFileName = this.getAttachmentFileName(attachment);
                        if (attachmentDescription?.length && attachmentFileName?.length) {
                            return `${attachmentDescription} (${attachmentFileName})`;
                        } else if (attachmentDescription?.length) {
                            return attachmentDescription;
                        } else if (attachmentFileName?.length) {
                            return attachmentFileName;
                        }
                        return null;
                    })
                    .filter((attachmentListItem) => attachmentListItem)
            );
        }
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const attachmentListItems = this.getAttachmentListItems(data);
            const title = !hideTitle && text;
            if (hideIfEmpty && !objectHasValue(attachmentListItems)) {
                this.style.display = "none";
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
