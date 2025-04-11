// Classes
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
 * Generates a list of attachment descriptions and filenames based on the provided attachments array.
 *
 * @param {Array} attachments - An array of attachment objects. Each object is expected to contain
 *                              the necessary data to create a `Vedlegg` instance.
 * @returns {Array<string>|undefined} A list of formatted attachment strings in the format
 *                                    "description (filename)", or just "description" or "filename"
 *                                    if one of them is missing. Returns an empty array if the input
 *                                    is not an array or is empty. Returns `undefined` if the input
 *                                    is falsy.
 */
export function getAttachmentListItems(attachments) {
    if (!attachments) {
        return undefined;
    }
    if (!Array.isArray(attachments)) {
        return [];
    }
    return attachments?.length
        ? attachments
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
        : [];
}
