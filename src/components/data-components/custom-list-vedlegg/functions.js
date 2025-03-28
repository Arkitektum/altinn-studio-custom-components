import Vedlegg from "../../../classes/data-classes/Vedlegg.js";

/**
 * Retrieves the description of an attachment based on its type.
 *
 * @param {Object} vedlegg - The attachment object.
 * @param {Object} [vedlegg.vedleggstype] - The type of the attachment.
 * @param {string} [vedlegg.vedleggstype.kodebeskrivelse] - The description of the attachment type.
 * @returns {string|undefined} The description of the attachment type, or undefined if not available.
 */
function getAttachmentDescription(vedlegg) {
    return vedlegg?.vedleggstype?.kodebeskrivelse;
}

/**
 * Retrieves the file name from a given attachment object.
 *
 * @param {Object} vedlegg - The attachment object.
 * @param {string} [vedlegg.filnavn] - The file name of the attachment.
 * @returns {string|undefined} The file name of the attachment, or undefined if not present.
 */
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
