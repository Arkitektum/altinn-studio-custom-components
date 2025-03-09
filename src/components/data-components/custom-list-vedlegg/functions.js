import Vedlegg from "../../../classes/data-classes/Vedlegg.js";

function getAttachmentDescription(vedlegg) {
    return vedlegg?.vedleggstype?.kodebeskrivelse;
}

function getAttachmentFileName(vedlegg) {
    return vedlegg?.filnavn;
}

/**
 * Generates a list of attachment descriptions and filenames.
 *
 * @param {Array} attachments - The list of attachment objects.
 * @returns {Array} A list of formatted attachment descriptions and filenames.
 */
export function getAttachmentListItems(attachments) {
    return (
        attachments?.length &&
        attachments
            .map((attachment) => {
                const vedlegg = new Vedlegg(attachment);
                const attachmentDescription = getAttachmentDescription(vedlegg);
                const attachmentFileName = getAttachmentFileName(vedlegg);
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
