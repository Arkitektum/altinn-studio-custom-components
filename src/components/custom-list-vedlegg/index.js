import { objectHasValue, renderFieldElement, renderListElement, renderListFieldElement } from "../../functions/helpers.js";

customElements.define(
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
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const title = !hideTitle && this.getAttribute("text");
            const attachmentListItems = this.getAttachmentListItems(formdata?.data);
            if (hideIfEmpty && !objectHasValue(attachmentListItems)) {
                this.style.display = "none";
            } else if (emptyFieldText?.length && !attachmentListItems?.length) {
                this.innerHTML = renderFieldElement(title, emptyFieldText);
            } else {
                this.innerHTML = title?.length
                    ? renderListFieldElement(title, attachmentListItems)
                    : renderListElement(attachmentListItems);
            }
        }
    }
);
